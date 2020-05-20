import React from 'react';
const TYPE_OF_TRANS = ['BUY', 'SELL'];

export const Transactions = ({ transactions }) => {
  return (
    <div>
      <h1>Transactions</h1>
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
