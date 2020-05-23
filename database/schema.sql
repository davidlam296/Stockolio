DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  balance DECIMAL NOT NULL
);

DROP TABLE IF EXISTS transactions CASCADE;
		
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type SMALLINT NOT NULL,
  ticker_symbol VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL,
  cost DECIMAL NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE INDEX trans_users ON transactions(user_id);

CREATE FUNCTION check_balance() RETURNS trigger AS $check_balance$
  BEGIN
    IF NEW.balance < 0 THEN
      RAISE EXCEPTION 'balance can not drop below 0';
    END IF;

    RETURN NEW;
  END;
$check_balance$ LANGUAGE plpgsql;

CREATE TRIGGER check_balance BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE check_balance();

-- INSERT INTO users (name, password, email, balance) VALUES ('david','p@ssw0rd','david@email.com',5000.00);