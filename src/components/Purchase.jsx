import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/purchase.css';

export const Purchase = ({
  balance,
  updateTransactions,
  updateBalance,
  setPortData,
}) => {
  const { isLoggedIn } = useContext(AuthContext);

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
    } else {
      setValidTicker(true);
    }

    if (!Number.isInteger(Number(quantity)) || quantity <= 0) {
      // Quantity input is invalid. Display warning message.
      setValidQuantity(false);
      return;
    } else {
      setValidQuantity(true);
    }

    const transaction = {
      type: 0,
      ticker: ticker.toUpperCase(),
      quantity: Number(quantity),
      userId: isLoggedIn.id,
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
        if (Number(total) > Number(balance)) {
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
              setPortData(null);
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
    <div id="purchase">
      <h2>{`Cash - $${balance ? Number(balance).toFixed(2) : 0}`}</h2>
      <h3>Stock Symbol</h3>
      <input
        value={ticker}
        placeholder="Ticker"
        onChange={(e) => setTicker(e.target.value)}
      ></input>
      <p
        style={{
          color: 'red',
          visibility: validTicker === false ? 'visible' : 'hidden',
        }}
      >
        Invalid ticker symbol. Please re-enter.
      </p>
      <h3>Quantity</h3>
      <input
        value={quantity}
        placeholder="Quantity"
        onChange={(e) => setQuantity(e.target.value)}
      ></input>
      <p
        style={{
          color: 'red',
          visibility: validQuantity === false ? 'visible' : 'hidden',
        }}
      >
        Enter a positive, whole number only.
      </p>
      <button onClick={handleSubmit}>Buy</button>
      <p
        style={{
          color: 'red',
          visibility: validBuy.valid === false ? 'visible' : 'hidden',
        }}
      >
        {validBuy.message || 'a\nb'}
      </p>
    </div>
  );
};
