import React, { useState } from 'react';
import axios from 'axios';

export const Purchase = ({ userInfo, updateTransactions }) => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [validTicker, setValidTicker] = useState(null);
  const [validQuantity, setValidQuantity] = useState(null);
  const [validBuy, setValidBuy] = useState(null);

  const handleSubmit = () => {
    const transaction = {
      type: 0,
      ticker,
      quantity: Number(quantity),
      userId: userInfo.id,
    };

    if (typeof ticker !== 'string' || ticker.trim().length < 1) {
      setValidTicker(false);
      return;
    }

    if (!Number.isInteger(Number(quantity))) {
      setValidQuantity(false);
      return;
    }

    setValidTicker(true);
    setValidQuantity(true);

    axios
      .get('/api/prices', {
        params: { stocks: [ticker] },
      })
      .then((result) => {
        transaction.cost = Number(result.data[0].latestPrice).toFixed(2);
        console.log(transaction.cost);
        console.log(transaction.quantity);

        const total = (transaction.quantity * transaction.cost).toFixed(2);
        console.log(total);

        if (total > userInfo.balance) {
          // Update warning. Not enough funds.
          console.log('Too expensive');
          setValidBuy(false);
          setWarningMessage(
            `Insufficent funds. Unable to purchase ${quantity.transaction} share(s) of (${transaction.ticker}) at $${transaction.cost} each. Your remaining balance is ${userInfo.balance}. Total cost is $${total}.`
          );
        } else {
          console.log('Transaction successful');
          setValidBuy(true);
          // add transaction
          // update user balance
        }
      })
      .catch((err) => {
        // Update warning. Couldn't retrieve data from API, double-check Ticker Symbol
        setValidBuy(false);
        setWarningMessage(
          'Please double-check stock ticker. Unable to get stock information and/or complete transaction.'
        );
      });
  };

  return (
    <div>
      <h1>{`Cash - $${userInfo.balance.toFixed(2)}`}</h1>
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
