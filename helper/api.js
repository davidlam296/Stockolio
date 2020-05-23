require('dotenv').config();
const axios = require('axios');

// Retrieve stock data based on stock symbol from IEX API.
module.exports.getPrice = (symbol) => {
  return axios
    .get(`${process.env.IEX_URL}/stable/stock/${symbol}/quote/`, {
      params: {
        token: process.env.IEX_TOKEN,
      },
    })
    .then((result) => result.data)
    .catch((err) => {
      throw err;
    });
};