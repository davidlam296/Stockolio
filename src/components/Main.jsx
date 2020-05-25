import React, { useState, useEffect, useContext } from 'react';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { Navigation } from './Navigation';
import AuthContext from '../context/AuthContext';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const PAGE_TYPES = ['Portfolio', 'Transactions'];

export const Main = () => {
  const { isLoggedIn, userInfo } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  const [transactions, setTransactions] = useState({});
  const [balance, setBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState('portfolio');

  const updateTransactions = () => {
    axios
      .get('/api/transactions', { params: { userId: 1 } })
      .then((result) => {
        setTransactions(result.data);
      })
      .catch((err) => {
        console.error('Could not get transactions', err);
      });
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  // Temporarily grab user data prior to setting up auth
  useEffect(() => {
    axios
      .get('/api/user')
      .then((results) => {
        console.log(results);
        setBalance(results.data.balance);
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
          balance={balance}
          updateTransactions={updateTransactions}
          updateBalance={updateBalance}
        />
      )}
    </div>
  );
};
