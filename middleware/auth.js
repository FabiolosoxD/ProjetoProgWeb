const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Garante que está pegando apenas o token após 'Bearer'
  if (!token) {
    return res.status(401).send('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send('Invalid token.');
  }
}

module.exports = auth;
