import React from 'react';

export const Navigation = ({ pages, changePage }) => (
  <div id="links">
    {pages.map((pageName) => (
      <p key={`PAGE+${pageName}`} onClick={() => changePage(pageName)}>
        {pageName}
      </p>
    ))}
  </div>
);
