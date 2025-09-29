const jwt = require('jsonwebtoken');
const user = require('../models/User');

const verifytoken = async (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) {
    return res.status(401).json({ message: 'aucun token fourni' });
  }

  const token = authheader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'format de token invalide' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findbyid(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'utilisateur non trouve' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifytoken };
