import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authenticate = async (email, password) => {
    const response = await axios.post('/api/authenticate', { email, password });

    if (response.status === 200) {
      await setIsLoggedIn(response.data);
      return true;
    } else {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
