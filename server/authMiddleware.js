require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.stockolio;
  console.log(token);
  console.log(req.cookies);

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      next();
    } catch {
      res.status(401).send('Unauthorized: Invalid token provided');
    }
  }
};