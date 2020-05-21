import React, { useState, useEffect } from 'react';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { Navigation } from './Navigation';
import { U, T } from '../../database/dummy_data';
import axios from 'axios';

// import { Login } from './Login';
// import { Register } from './Register';

const PAGE_TYPES = ['Portfolio', 'Transactions'];

export const App = (props) => {
  const [transactions, setTransactions] = useState(T);
  const [userInfo, setUserInfo] = useState(U);
  const [currentPage, setCurrentPage] = useState('portfolio');

  const updateTransactions = () => {
    axios
      .get('/transactions')
      .then((result) => {
        setTransactions(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <Navigation changePage={setCurrentPage} pages={PAGE_TYPES} />
      {currentPage === 'Transactions' ? (
        <Transactions transactions={transactions} />
      ) : (
        <Portfolio
          transactions={transactions}
          userInfo={userInfo}
          updateTransactions={updateTransactions}
        />
      )}
    </div>
  );
};
