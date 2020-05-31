import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const authenticate = async (email, password) => {
    const response = await axios
      .post('/api/authenticate', { email, password })
      .then((response) => response)
      .catch((err) => err);

    if (response.status === 200) {
      await setIsLoggedIn(response.data);
      return true;
    } else {
      await setIsLoggedIn(false);
      return false;
    }
  };

  const checkToken = async (token) => {
    const response = await axios
      .get('/api/checkToken')
      .then((response) => response)
      .catch((err) => err);

    if (response.status === 200) {
      await setIsLoggedIn(response.data);
    } else {
      await setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        checkToken,
        authenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
