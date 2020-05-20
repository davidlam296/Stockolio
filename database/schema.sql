DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS transactions;
		
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type SMALLINT NOT NULL,
  ticker_symbol VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL,
  cost DECIMAL NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

CREATE INDEX trans_users ON transactions(user_id);