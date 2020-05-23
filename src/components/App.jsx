import React, { useState, useEffect } from 'react';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { Navigation } from './Navigation';
import axios from 'axios';

// import { Login } from './Login';
// import { Register } from './Register';

const PAGE_TYPES = ['Portfolio', 'Transactions'];

// User Info should be passed down props after authentication
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

  // Temporarily grab user data prior to setting up auth
  useEffect(() => {
    axios
      .get('/user')
      .then((results) => {
        setUserInfo(
          Object.assign({}, results.data, {
            balance: Number(results.data.balance),
          })
        );
        updateTransactions();
      })
      .catch((err) => console.log('ERROR: ', err));
  }, []);

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
