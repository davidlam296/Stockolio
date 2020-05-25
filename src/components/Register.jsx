import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
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
    password: 'Password must contain at least 6 characters',
    reenteredPassword: 'Does not match password',
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

  if (isRegistered) {
    return <Redirect to="/login" />;
  }

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
      {errors.name ? <p>{errorMessages.name}</p> : null}
      <p>Email:</p>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Enter email"
      />
      {errors.email ? <p>{errorMessages.email}</p> : null}
      {errors.duplicate ? <p>{errorMessages.duplicate}</p> : null}
      <p>Password:</p>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Enter password"
      />
      {errors.password ? <p>{errorMessages.password}</p> : null}
      <p>Re-enter password:</p>
      <input
        type="password"
        onChange={(e) => setReenteredPassword(e.target.value)}
        value={reenteredPassword}
        placeholder="Enter password again"
      />
      {errors.reenteredPassword ? (
        <p>{errorMessages.reenteredPassword}</p>
      ) : null}
      <button onClick={handleSubmit}>Register!</button>
      <Link to="/login">
        <p>Already registered?</p>
      </Link>
    </div>
  );
};
