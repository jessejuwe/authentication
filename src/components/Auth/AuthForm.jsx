import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCTX = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const submitHandler = async event => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Start Loading
    setIsLoading(true);

    // TODO: Validation

    const postMethod = {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    // helper variable
    let url;
    let message;

    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAoIehQzmX7DlFX3ZLm6al8d3oHPD7kiE8';

      message = 'User successfully logged in!';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAoIehQzmX7DlFX3ZLm6al8d3oHPD7kiE8';

      message = 'New user registered';
    }

    try {
      const response = await fetch(url, postMethod);

      // Stop Loading
      setIsLoading(false);

      if (response.ok) {
        emailInputRef.current.value = passwordInputRef.current.value = '';
        console.log(message);

        const data = await response.json();
        console.log(data);

        authCTX.login(data.idToken);
      } else {
        const data = await response.json();

        // TODO: show error modal

        // helper variable
        let errorMessage = 'Authentication failed!';

        // prettier-ignore
        if (data && data.error && data.error.message) errorMessage = data.error.message;

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`💥 ${error.message} 💥`);
      alert(`💥 ${error.message} 💥`);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
