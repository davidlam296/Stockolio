import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/register.css';

export const Register = () => {
  const { checkToken, isLoggedIn } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    reenteredPassword: false,
    duplicate: false,
  });

  const errorMessages = {
    name: 'Name can not be empty',
    email: 'Please enter valid email address',
    password: 'Password must contain 6 characters',
    reenteredPassword: 'Password does not match',
    duplicate: 'Email is already registered',
  };

  const handleSubmit = async () => {
    const updatedErrors = Object.assign({}, errors, { duplicate: false });
    if (name.trim().length < 1) {
      updatedErrors.name = true;
    } else {
      updatedErrors.name = false;
    }

    if (email.trim().length < 6) {
      updatedErrors.email = true;
    } else {
      updatedErrors.email = false;
    }

    if (password.trim().length < 6) {
      updatedErrors.password = true;
    } else {
      updatedErrors.password = false;
    }
    if (reenteredPassword.trim().length < 6 || reenteredPassword !== password) {
      updatedErrors.reenteredPassword = true;
    } else {
      updatedErrors.reenteredPassword = false;
    }

    await setErrors(updatedErrors);

    if (Object.values(updatedErrors).includes(true)) {
      return;
    } else {
      axios
        .post('/api/user', { name, email, password })
        .then((response) => {
          if (response.status === 201) {
            setIsRegistered(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 422) {
            setErrors(Object.assign({}, errors, { email: true }));
          }
          if (err.response.status === 409) {
            setErrors(Object.assign({}, errors, { duplicate: true }));
          }
        });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      checkToken();
    }
  }, []);

  if (isLoggedIn) {
    return <Redirect to="/home" />;
  } else if (isRegistered) {
    return <Redirect to="/login" />;
  } else if (isLoggedIn === false) {
    return (
      <div id="register">
        <h1>Register</h1>
        <p>Name:</p>
        <input
          type="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter name"
        />
        <p
          style={{
            color: 'red',
            visibility: errors.name ? 'visible' : 'hidden',
          }}
        >
          {errorMessages.name}
        </p>
        <p>Email:</p>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter email"
        />
        <p
          style={{
            color: 'red',
            visibility: errors.email || errors.duplicate ? 'visible' : 'hidden',
          }}
        >
          {errors.email ? errorMessages.email : errorMessages.duplicate}
        </p>
        <p>Password:</p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Enter password"
        />
        <p
          style={{
            color: 'red',
            visibility: errors.password ? 'visible' : 'hidden',
          }}
        >
          {errorMessages.password}
        </p>
        <p>Re-enter password:</p>
        <input
          type="password"
          onChange={(e) => setReenteredPassword(e.target.value)}
          value={reenteredPassword}
          placeholder="Enter password again"
        />
        <p
          style={{
            color: 'red',
            visibility: errors.reenteredPassword ? 'visible' : 'hidden',
          }}
        >
          {errorMessages.reenteredPassword}
        </p>
        <button onClick={handleSubmit}>Sign Up!</button>
        <Link to="/login">
          <h3>Already have an account?</h3>
        </Link>
      </div>
    );
  } else {
    return null;
  }
};
