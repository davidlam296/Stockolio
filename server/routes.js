const router = require('express').Router();
const { getPrice } = require('../helper/api');
const { validateEmail } = require('../helper/validate');
const {
  getTransactions,
  addTransaction,
  getUserData,
  checkExisting,
  addUser,
} = require('./models');

// Retrieves current stock information, based on ticker symbol and sends it to client.
router.get('/prices', (req, res) => {
  if (!req.query.stocks) {
    res.sendStatus(400);
  } else {
    const prices = [];

    for (const symbol of req.query.stocks) {
      prices.push(getPrice(symbol));
    }

    Promise.all(prices)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        // console.log('ERROR :', err);
        res.sendStatus(500);
      });
  }
});

// Retrieves user information from database -- login
router.get('/user', (req, res) => {
  getUserData()
    .then((result) => {
      res.status(200).send(result.rows[0]);
    })
    .catch((err) => {
      // console.log('ERROR: ', err);
      res.sendStatus(400);
    });
});

// Create a user, check if user exists first, save into database otherwise
router.post('/user', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.sendStatus(400);
  } else if (!validateEmail(email)) {
    res.sendStatus(422);
  } else {
    checkExisting(req.body.email)
      .then((result) => {
        if (result.rows.length > 0) {
          throw new Error('duplicate');
        } else {
          return addUser(req.body);
        }
      })
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        // console.log('ERROR: ', err);
        err.message === 'duplicate' ? res.sendStatus(409) : res.sendStatus(400);
      });
  }
});

// Retrieves transaction data of a user, based on user ID and sends it to client.
router.get('/transactions', (req, res) => {
  if (!req.query.userId) {
    res.sendStatus(400);
  } else {
    getTransactions(req.query.userId)
      .then((result) => {
        res.status(200).send(result.rows);
      })
      .catch((err) => {
        // console.log('ERROR: ', err);
        res.sendStatus(400);
      });
  }
});

// Saves transaction information into database, based on requset from client.
router.post('/transactions', (req, res) => {
  addTransaction(req.body)
    .then((result) => {
      res.status(201).send(result.rows[0].balance);
    })
    .catch((err) => {
      // console.log('ERROR: ', err);
      res.sendStatus(400);
    });
});

module.exports = router;
