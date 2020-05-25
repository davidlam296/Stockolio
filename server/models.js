const pool = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function needs to be revised later to search based on password for authentication
module.exports.getUserData = (id) => {
  return (async () => {
    const client = await pool.connect();
    try {
      return await client.query(
        'SELECT id, name, email, balance FROM users WHERE id = $1',
        [id]
      );
    } finally {
      client.release();
    }
  })();
};

// Checks to see if a user with an email already exists in the database
module.exports.checkExisting = (email) => {
  return (async () => {
    const client = await pool.connect();
    try {
      return await client.query(`SELECT id FROM users WHERE email = $1`, [
        email,
      ]);
    } finally {
      client.release();
    }
  })();
};

// Inserts a new user into the database
module.exports.addUser = ({ email, name, password }) => {
  console.log(email, name, password);

  return (async () => {
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return await client.query(
        `INSERT INTO users (name, password, email, balance) VALUES ($1, $2, $3, $4)`,
        [name, hashedPassword, email, (5000).toFixed(2)]
      );
    } finally {
      client.release();
    }
  })();
};

// 0 is a buy transaction
const TYPES_OF_TRANSACTIONS = [0];

// Select transactions based on user ID from database.
module.exports.getTransactions = (userId) => {
  return (async () => {
    const client = await pool.connect();
    try {
      return await client.query(
        'SELECT * FROM transactions WHERE user_id = $1',
        [userId]
      );
    } finally {
      client.release();
    }
  })();
};

/*  Insert transaction into database.
    Required Fields:
      type: type of transaction,
      ticker: stock symbol,
      quantity: number of stocks purchased,
      cost: cost per share,
      userId: user ID associated with transaction  */
module.exports.addTransaction = (transaction) => {
  if (!TYPES_OF_TRANSACTIONS.includes(transaction.type))
    throw new Error('Wrong transaction type');
  if (
    typeof transaction.ticker !== 'string' ||
    transaction.ticker.trim() === ''
  )
    throw new Error('Invalid stock symbol');
  if (isNaN(transaction.quantity)) throw new Error('Invalid quantity');
  if (isNaN(transaction.cost)) throw new Error('Invalid cost');
  if (isNaN(transaction.userId)) throw new Error('Invalid user ID');

  return (async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const response = await client.query(
        `UPDATE users SET balance = balance - ${transaction.total} WHERE id = ${transaction.userId} RETURNING balance`
      );

      await client.query(
        'INSERT INTO transactions(type, ticker_symbol, quantity, cost, user_id) VALUES ($1, $2, $3, $4, $5)',
        [
          transaction.type,
          transaction.ticker,
          transaction.quantity,
          transaction.cost,
          transaction.userId,
        ]
      );
      await client.query('COMMIT');

      return response;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  })();
};
