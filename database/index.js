const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'uncreative',
  password: process.env.PG_PASSWORD || null,
  database: process.env.PG_DATABASE || 'stockolio',
});

(async () => {
  const client = await pool.connect();

  console.log('Connected to the database!');
  client.release();
})().catch((err) => console.error('Failed to connect to database', err));

module.exports = pool;
