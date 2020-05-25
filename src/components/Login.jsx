import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export const Login = (props) => {
  const { authenticate, isLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const errorMessage = 'Invalid username or password. Please re-enter.';

  const attemptLogin = () => {
    /*  If length of input password or email is less than 6, just display warning message
        Will be set as minimum requirements when registering.  */
    if (email.trim().length < 6 || password.trim().length < 6) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
      if (!authenticate(email, password)) {
        setIsError(false);
      }
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <div id="login">
      <h1>Login</h1>
      <p>Email:</p>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Enter email"
      />
      <p>Password:</p>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Enter password"
      />
      <button onClick={(e) => attemptLogin()}>Log in!</button>
      {isError ? <p>{errorMessage}</p> : null}
      <Link to="/register">
        <p>Don't have an account?</p>
      </Link>
    </div>
  );
};
