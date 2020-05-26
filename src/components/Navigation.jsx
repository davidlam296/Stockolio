import React from 'react';
import '../styles/navigation.css';

export const Navigation = ({ pages, changePage }) => {
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
      <p className="link">Logout</p>
    </div>
  );
};
