import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import '../styles/navigation.css';

export const Navigation = ({ pages, changePage }) => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const handleClick = () => {
    axios
      .get('/api/logout')
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => console.log('Failed to log out...'));
  };

  return (
    <div id="links">
      {pages.map((pageName) => (
        <p
          key={`PAGE+${pageName}`}
          className="link"
          onClick={() => changePage(pageName)}
        >
          {pageName}
        </p>
      ))}
      <p className="link" onClick={handleClick}>
        Logout
      </p>
    </div>
  );
};
