require('dotenv').config();
const axios = require('axios');

module.exports.getPrice = (symbol) => {
  return axios
    .get(`${process.env.IEX_URL}/stable/stock/${symbol}/quote/`, {
      params: {
        token: process.env.IEX_TOKEN,
      },
    })
    .then((result) => result.data)
    .catch((err) => console.log(err));
};
