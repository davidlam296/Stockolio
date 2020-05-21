const router = require('express').Router();
const { getPrice } = require('../helper/api');
const { getTransactions, addTransaction } = require('./models');

// Retrieves current stock information, based on ticker symbol and sends it to client.
router.get('/api/prices', (req, res) => {
  const prices = [];

  for (const symbol of req.query.stocks) {
    prices.push(getPrice(symbol));
  }

  Promise.all(prices)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Retrieves transaction data of a user, based on user ID and sends it to client.
router.get('/transactions', (req, res) => {
  // *** Defaults to first user in database for development; prior to authentication set up ***
  getTransactions(req.query.userId || 1)
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      console.log('ERROR: ', err);
      res.sendStatus(400);
    });
});

// Saves transaction information into database, based on requset from client.
router.post('/transactions', (req, res) => {
  getPrice(req.body.ticker)
    .then((result) => {
      req.body.cost = result.latestPrice.toFixed(2);
    })
    .then(() => {
      return addTransaction(req.body);
    })
    .then(() => {
      res.status(201).send('Transaction Complete');
    })
    .catch((err) => {
      console.log('ERROR: ', err);
      res.sendStatus(400);
    });
});

module.exports = router;
