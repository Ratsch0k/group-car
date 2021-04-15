import React, {useRef} from 'react';
import {
  SignUpForm,
  SignUpRequest,
  SignUpThroughRequest,
} from 'lib';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {
  signUp as signUpThunk,
  getSignUpRequestSent,
} from 'lib/redux/slices/auth';
import {unwrapResult} from '@reduxjs/toolkit';

export interface SignUpBodyProps {
  withSubmit?: boolean;
  onFinished?(): void;
  setLoading?(arg0: boolean): void;
}

/**
 * Element which handles the response from the server,
 * if direct sign up is not possible. Will animate to the SignUpRequest
 * element.
 * @param props Forwards props to the SignUpForm
 */
export const SignUpBody: React.FC<SignUpBodyProps> = (props) => {
  // Whether or not sign up is not directly possible.
  const isSignUpThroughRequest = useAppSelector(getSignUpRequestSent);

  const dispatch = useAppDispatch();
  /**
   * Ref of real sign up body. Used to set size for sign up request element.
   */
  const signUpRef = useRef<HTMLDivElement>(null);

  /**
   * Wrapper for the sign up requests.
   * Handles if the backend is configured to not allow direct
   * sign up.
   * @param username  Username
   * @param email     Email
   * @param password  Password
   * @param offset    Offset which is used to generate
   *  different profile pictures for the same username
   */
  const signUp = async (
    username: string,
    email: string,
    password: string,
    offset: number,
  ): SignUpRequest => {
    props.setLoading && props.setLoading(true);
    try {
      const response = unwrapResult(await dispatch(
        signUpThunk({username, email, password, offset})));

      /*
           * If response status was 202 expect
           * that backend is configured to not allow direct sign up
          */
      if (response.status === 202) {
        props.setLoading && props.setLoading(false);
      } else {
        props.setLoading && props.setLoading(false);
        props.onFinished && props.onFinished();
      }
      return response;
    } catch (e) {
      props.setLoading && props.setLoading(false);
      throw e;
    }
  };

  /*
   * If the sign up is not directly possible, show the user
   * the element which will inform him/her about that.
  */
  if (isSignUpThroughRequest) {
    return (
      <div style={{
        height: signUpRef.current !== null ?
          signUpRef.current.clientHeight :
          undefined,
      }}>
        <SignUpThroughRequest />
      </div>
    );
  } else {
    return (
      <div ref={signUpRef}>
        <SignUpForm signUp={signUp} {...props}/>
      </div>
    );
  }
};

export default SignUpBody;
