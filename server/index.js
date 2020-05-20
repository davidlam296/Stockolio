require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();


app.use('/', express.static(path.join(__dirname, '../dist')));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at port ${process.env.PORT}`);
  console.log(`Go to: ${process.env.ROOT}:${process.env.PORT}`);
});
