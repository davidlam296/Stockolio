const { Client } = require('pg');
const client = new Client({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'uncreative',
  password: process.env.PG_PASSWORD || null,
  database: process.env.PG_DATABASE || 'stockolio',
});

client
  .connect()
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
  });

module.exports = client;
