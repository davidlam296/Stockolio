require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.stockolio;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.email = decoded.email;
      next();
    } catch {
      res.status(401).send('Unauthorized: Invalid token provided');
    }
  }
};
