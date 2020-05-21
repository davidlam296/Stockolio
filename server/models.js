const db = require('../database');

// 0 is a buy transaction
const TYPES_OF_TRANSACTIONS = [0]; 

// Select transactions based on user ID from database.
module.exports.getTransactions = (userId) => {
  const text = 'SELECT * FROM transactions WHERE user_id = $1';
  const values = [userId];

  return db.query(text, values);
};

/*  Insert transaction into database.
    Required Fields:
      type: type of transaction,
      ticker: stock symbol,
      quantity: number of stocks purchased,
      cost: total per share,
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

  const text =
    'INSERT INTO transactions(type, ticker_symbol, quantity, cost, user_id) VALUES ($1, $2, $3, $4, $5)';
  const values = [
    transaction.type,
    transaction.ticker,
    transaction.quantity,
    transaction.cost,
    transaction.userId,
  ];

  return db.query(text, values);
};
