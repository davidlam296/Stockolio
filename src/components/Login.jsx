import React from 'react';
import { Link } from 'react-router-dom';

export const Login = (props) => (
  <div id="login">
    <h1>Login</h1>
    <p>Email:</p>
    <input></input>
    <p>Password:</p>
    <input></input>
    <Link to="/register">
      <p>Don't have an account?</p>
    </Link>
  </div>
);
