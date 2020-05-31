require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const routes = require('./routes.js');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

if (process.env.DEV === '1') {
  app.listen(process.env.PORT, () => {
    console.log(`Listening at port ${process.env.PORT}`);
    console.log(`Go to: ${process.env.ROOT}:${process.env.PORT}`);
  });
} else {
  const key = fs.readFileSync(path.join(__dirname, '../selfsigned.key'));
  const cert = fs.readFileSync(path.join(__dirname, '../selfsigned.crt'));
  const server = https.createServer({ key, cert }, app);
  server.listen(process.env.PORT, () => {
    console.log(`Listening at port ${process.env.PORT}`);
    console.log(`Go to: ${process.env.ROOT}:${process.env.PORT}`);
  });
}
