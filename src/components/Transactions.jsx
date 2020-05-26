import React from 'react';
import '../styles/transactions.css';
const TYPE_OF_TRANS = ['BUY', 'SELL'];

export const Transactions = ({ transactions }) => {
  return (
    <div id="transactions">
      <h1>Transactions</h1>
      {transactions.length < 1 ? <p>No trasactions yet.</p> : null}
      {transactions.map((t) => (
        <p key={t.id}>
          {`${TYPE_OF_TRANS[t.type]} (${t.ticker_symbol}) - ${
            t.quantity
          } shares @ $${t.cost}`}
        </p>
      ))}
    </div>
  );
};
