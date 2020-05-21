import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { Navigation } from './Navigation';
import { U, T } from '../../database/dummy_data';

const PAGE_TYPES = ['Portfolio', 'Transactions']

export const App = () => {
  const [transactions, setTransactions] = useState(T);
  const [userInfo, setUserInfo] = useState(U);
  const [currentPage, setCurrentPage] = useState('portfolio');

  return (
    <div>
      <Navigation changePage={setCurrentPage} pages={PAGE_TYPES} />
      {currentPage === 'Transactions' ? (
        <Transactions transactions={transactions} />
      ) : (
        <Portfolio transactions={transactions} userInfo={userInfo} />
      )}
    </div>
  );
};
