require('dotenv').config();
const router = require('express').Router();
const { getPrice } = require('../helper/api');
const { validateEmail } = require('../helper/validate');
const { auth } = require('./authMiddleware');
const {
  getTransactions,
  addTransaction,
  getUserData,
  checkExisting,
  addUser,
} = require('./models');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/*
╭╮╱╭╮╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╭╮╱╱╱╱╱╭╮╭━━━╮╱╱╱╱╱╭╮
┃┃╱┃┃╱╱╱╱╱╱╱╱╱╭╯╰╮╱╱╱╱╭╯╰╮╱╱╱╱┃┃┃╭━╮┃╱╱╱╱╭╯╰╮
┃┃╱┃┣━╮╭━━┳━┳━┻╮╭╋━━┳━┻╮╭╋━━┳━╯┃┃╰━╯┣━━┳╮┣╮╭╋━━┳━━╮
┃┃╱┃┃╭╮┫╭╮┃╭┫╭╮┃┃┃┃━┫╭━┫┃┃┃━┫╭╮┃┃╭╮╭┫╭╮┃┃┃┃┃┃┃━┫━━┫
┃╰━╯┃┃┃┃╰╯┃┃┃╰╯┃╰┫┃━┫╰━┫╰┫┃━┫╰╯┃┃┃┃╰┫╰╯┃╰╯┃╰┫┃━╋━━┃
╰━━━┻╯╰┫╭━┻╯╰━━┻━┻━━┻━━┻━┻━━┻━━╯╰╯╰━┻━━┻━━┻━┻━━┻━━╯
╱╱╱╱╱╱╱┃┃
╱╱╱╱╱╱╱╰╯ */

// Authenticates user login attempt
router.post('/authenticate', (req, res) => {
  const { email, password } = req.body;
  const userData = {};

  checkExisting(email)
    .then(({ rows }) => {
      const { id } = rows[0];
      userData.id = id;
      return getUserData(id);
    })
    .then(({ rows }) => {
      const hash = rows[0].password;
      const { name, email } = rows[0];
      userData.name = name;
      userData.email = email;
      return bcrypt.compare(password, hash);
    })
    .then((result) => {
      if (result) {
        const token = jwt.sign({ email }, process.env.SECRET, {
          expiresIn: '1h',
        });
        res
          .cookie('stockolio', token, { httpOnly: true })
          .status(200)
          .send(userData);
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => res.sendStatus(500));
});

// Create a user
router.post('/user', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.sendStatus(400);
  } else if (!validateEmail(email)) {
    res.sendStatus(422);
  } else {
    // Check to see if a user exists first - based on email
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

router.get('/logout', (req, res) => {
  res.clearCookie('stockolio');
  res.sendStatus(200);
});

/*
╭━━━╮╱╱╱╱╭╮╱╱╱╱╱╱╭╮╱╱╱╱╱╭╮╭━━━╮╱╱╱╱╱╭╮
┃╭━╮┃╱╱╱╭╯╰╮╱╱╱╱╭╯╰╮╱╱╱╱┃┃┃╭━╮┃╱╱╱╱╭╯╰╮
┃╰━╯┣━┳━┻╮╭╋━━┳━┻╮╭╋━━┳━╯┃┃╰━╯┣━━┳╮┣╮╭╋━━┳━━╮
┃╭━━┫╭┫╭╮┃┃┃┃━┫╭━┫┃┃┃━┫╭╮┃┃╭╮╭┫╭╮┃┃┃┃┃┃┃━┫━━┫
┃┃╱╱┃┃┃╰╯┃╰┫┃━┫╰━┫╰┫┃━┫╰╯┃┃┃┃╰┫╰╯┃╰╯┃╰┫┃━╋━━┃
╰╯╱╱╰╯╰━━┻━┻━━┻━━┻━┻━━┻━━╯╰╯╰━┻━━┻━━┻━┻━━┻━━╯
*/

// Retrieves current stock information - based on ticker symbol
router.get('/prices', auth, (req, res) => {
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

// Retrieves user information from database - based on user ID
router.get('/user', auth, (req, res) => {
  if (!req.query.userId) {
    res.sendStatus(400);
  } else {
    getUserData(req.query.userId)
      .then((result) => {
        res.status(200).send(result.rows[0]);
      })
      .catch((err) => {
        // console.log('ERROR: ', err);
        res.sendStatus(400);
      });
  }
});

// Retrieves transaction data of a user - based on user ID
router.get('/transactions', auth, (req, res) => {
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

/*  Insert transaction into database.
    Required Fields:
      type: type of transaction,
      ticker: stock symbol,
      quantity: number of stocks purchased,
      cost: cost per share,
      userId: user ID associated with transaction  */
router.post('/transactions', auth, (req, res) => {
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
