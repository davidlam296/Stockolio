require('dotenv').config();
const express = require('express');
const path = require('path');
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

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at port ${process.env.PORT}`);
  console.log(`Go to: ${process.env.ROOT}:${process.env.PORT}`);
});
