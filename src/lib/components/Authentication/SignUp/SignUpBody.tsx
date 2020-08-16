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

const SignUpBody: React.FC<SignUpBodyProps> = (props) => {
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
