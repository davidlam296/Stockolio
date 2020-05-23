import React, { useState, useEffect } from 'react';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { Navigation } from './Navigation';
import axios from 'axios';

// import { U, T } from '../../database/dummy_data';

// import { Login } from './Login';
// import { Register } from './Register';

const PAGE_TYPES = ['Portfolio', 'Transactions'];

export const App = (props) => {
  const [transactions, setTransactions] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [currentPage, setCurrentPage] = useState('portfolio');

  const updateTransactions = () => {
    axios
      .get('/transactions', { params: { userId: 1 } })
      .then((result) => {
        setTransactions(result.data);
      })
      .catch((err) => {
        console.error('Could not get transactions', err);
      });
  };

  const updateBalance = (newBalance) => {
    setUserInfo(Object.assign({}, userInfo, { balance: newBalance }));
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
          updateBalance={updateBalance}
        />
      )}
    </div>
  );
};
