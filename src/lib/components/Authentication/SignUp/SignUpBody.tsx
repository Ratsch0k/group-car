import React, {useState, useContext, useRef} from 'react';
import {default as SignUpRequestElement} from './SignUpRequest';
import SignUpForm from './SignUpForm';
import AuthContext from 'lib/context/auth/authContext';
import {SignUpRequest} from 'lib/requests/signUp';

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
const SignUpBody: React.FC<SignUpBodyProps> = (props) => {
  // Whether or not sign up is not directly possible.
  const [
    isSignUpThroughRequest,
    setIsSignUpThroughRequest,
  ] = useState<boolean>(false);

  const auth = useContext(AuthContext);
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
  const signUp = (
      username: string,
      email: string,
      password: string,
      offset: number,
  ): SignUpRequest => {
    props.setLoading && props.setLoading(true);
    const request = auth.signUp(username, email, password, offset);
    request.request.then((response) => {
      /*
           * If response status was 202 expect
           * that backend is configured to not allow direct sign up
          */
      if (response.status === 202) {
        props.setLoading && props.setLoading(false);
        setIsSignUpThroughRequest(true);
      } else {
        props.setLoading && props.setLoading(false);
        props.onFinished && props.onFinished();
      }
      return response;
    }).catch((e) => {
      props.setLoading && props.setLoading(false);
      throw e;
    });

    return request;
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
        <SignUpRequestElement />
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
