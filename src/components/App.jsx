import React from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Portfolio } from './Portfolio';
import { Transactions } from './Transactions';

export const App = () => (
  <div>
    <Portfolio />
    <Transactions />
  </div>
);
