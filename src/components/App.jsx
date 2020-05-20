import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';
import { U, T } from '../../database/dummy_data';

export const App = () => {
  const [transactions, setTransactions] = useState(T);
  const [userInfo, setUserInfo] = useState(U);

  return (
    <div>
      <Portfolio transactions={transactions} userInfo={userInfo} />
      <Transactions transactions={transactions} />
    </div>
  );
};
