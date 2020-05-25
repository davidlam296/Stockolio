import React, { useState } from 'react';
import axios from 'axios';

export const Purchase = ({ balance, updateTransactions, updateBalance }) => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [validTicker, setValidTicker] = useState(null);
  const [validQuantity, setValidQuantity] = useState(null);
  const [validBuy, setValidBuy] = useState({ valid: null, message: '' });

  const handleSubmit = () => {
    if (typeof ticker !== 'string' || ticker.trim().length < 1) {
      // Ticker input is empty and invalid. Display warning message.
      setValidTicker(false);
      return;
    }

    if (!Number.isInteger(Number(quantity)) || quantity <= 0) {
      // Quantity input is invalid. Display warning message.
      setValidQuantity(false);
      return;
    }

    const transaction = {
      type: 0,
      ticker: ticker.toUpperCase(),
      quantity: Number(quantity),
      userId: 1,
    };

    setValidTicker(true);
    setValidQuantity(true);

    axios
      .get('/api/prices', {
        params: { stocks: [ticker] },
      })
      .then((result) => {
        transaction.cost = Number(result.data[0].latestPrice).toFixed(2);
        const total = Number(transaction.quantity * transaction.cost).toFixed(
          2
        );

        // Not enough funds. Display warning message.
        if (total > balance) {
          setValidBuy({
            valid: false,
            message: `Insufficent funds. Unable to purchase ${transaction.quantity} share(s) of (${transaction.ticker}) at $${transaction.cost} each. Your remaining balance is $${balance}. Total cost is $${total}.`,
          });
        } else {
          transaction.total = total;
          setValidBuy(true);
          axios
            .post('/api/transactions', transaction)
            .then((newBalance) => {
              updateTransactions();
              updateBalance(newBalance.data);
            })
            .catch((err) => {
              console.log('There was an error processing transaction: ', err);
            });
        }
      })
      .catch((err) => {
        // Potential issue with the API or ticker was invalid.
        setValidBuy({
          valid: false,
          message:
            'Please double-check stock ticker. Unable to get stock information and/or complete transaction.',
        });
      });
  };

  return (
    <div>
      <h1>{`Cash - $${balance ? balance : 0}`}</h1>
      <h3>Stock Symbol</h3>
      <input
        value={ticker}
        placeholder="Ticker"
        onChange={(e) => setTicker(e.target.value)}
      ></input>
      {validTicker === false ? (
        <p>Invalid ticker symbol. Please re-enter.</p>
      ) : null}
      <h3>Quantity</h3>
      <input
        value={quantity}
        placeholder="Quantity"
        onChange={(e) => setQuantity(e.target.value)}
      ></input>
      {validQuantity === false ? (
        <p>Invalid quantity. Enter a positive, whole number only.</p>
      ) : null}
      <button onClick={handleSubmit}>Buy</button>
      {validBuy.valid === false ? <p>{validBuy.message}</p> : null}
    </div>
  );
};
