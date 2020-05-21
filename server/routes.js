const router = require('express').Router();
const { getPrice } = require('../helper/api');

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
      res.sendStatus(404);
    });
});

router.get('/transactions', (req, res) => {
  res.status(200).send('Transactions');
});

router.post('/transactions', (req, res) => {
  res.status(201).send('Transaction Complete');
});

module.exports = router;
