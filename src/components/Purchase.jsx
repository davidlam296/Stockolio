import React, { useState } from 'react';
import axios from 'axios';

export const Purchase = ({ userInfo, updateTransactions, updateBalance }) => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [validTicker, setValidTicker] = useState(null);
  const [validQuantity, setValidQuantity] = useState(null);
  const [validBuy, setValidBuy] = useState(null);

  const handleSubmit = () => {
    if (typeof ticker !== 'string' || ticker.trim().length < 1) {
      // Ticker input is empty and invalid. Display warning message.
      setValidTicker(false);
      return;
    }

    if (!Number.isInteger(Number(quantity))) {
      // Quantity input is invalid. Display warning message.
      setValidQuantity(false);
      return;
    }

    const transaction = {
      type: 0,
      ticker: ticker.toUpperCase(),
      quantity: Number(quantity),
      userId: userInfo.id,
    };

    setValidTicker(true);
    setValidQuantity(true);

    axios
      .get('/api/prices', {
        params: { stocks: [ticker] },
      })
      .then((result) => {
        transaction.cost = Number(result.data[0].latestPrice).toFixed(2);
        const total = (transaction.quantity * transaction.cost).toFixed(2);

        // Not enough funds. Display warning message.
        if (total > userInfo.balance) {
          setValidBuy(false);
          setWarningMessage(
            `Insufficent funds. Unable to purchase ${quantity.transaction} share(s) of (${transaction.ticker}) at $${transaction.cost} each. Your remaining balance is ${userInfo.balance}. Total cost is $${total}.`
          );
        } else {
          transaction.total = total;
          setValidBuy(true);
          axios
            .post('/transactions', transaction)
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
        setValidBuy(false);
        setWarningMessage(
          'Please double-check stock ticker. Unable to get stock information and/or complete transaction.'
        );
      });
  };

  return (
    <div>
      <h1>{`Cash - $${userInfo.balance ? userInfo.balance : 0}`}</h1>
      <h3>Stock Symbol</h3>
      <input
        value={ticker}
        placeholder="Ticker"
        onChange={(e) => setTicker(e.target.value)}
      ></input>
      <p>Warning Placeholder</p>
      <h3>Quantity</h3>
      <input
        value={quantity}
        placeholder="Quantity"
        onChange={(e) => setQuantity(e.target.value)}
      ></input>
      <p>Warning Placeholder</p>
      <button onClick={handleSubmit}>Buy</button>
      <p>Warning Placeholder</p>
    </div>
  );
};
