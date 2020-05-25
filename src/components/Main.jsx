import React, { useState, useEffect, useContext } from 'react';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { Navigation } from './Navigation';
import AuthContext from '../context/AuthContext';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const PAGE_TYPES = ['Portfolio', 'Transactions'];

export const Main = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  const [transactions, setTransactions] = useState({});
  const [balance, setBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState('portfolio');

  const updateTransactions = () => {
    axios
      .get('/api/transactions', { params: { userId: isLoggedIn.id } })
      .then((result) => {
        setTransactions(result.data);
      })
      .catch((err) => {
        console.error('Could not get transactions', err);
      });
  };

  useEffect(() => {
    axios
      .get('/api/user', { params: { userId: isLoggedIn.id } })
      .then((results) => {
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
          updateBalance={setBalance}
        />
      )}
    </div>
  );
};
