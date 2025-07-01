const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
const validateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: User not logged in - ValToken' });
  }

  try {
    const decodedToken = jwt.verify(token, 'kdhfbgaimdfwopqpfh');
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = validateToken;
