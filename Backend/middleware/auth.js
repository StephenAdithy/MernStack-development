const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = process.env;

module.exports = async function(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Authorization missing' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // attach user info to req
    req.user = { id: payload.id, role: payload.role, email: payload.email, name: payload.name };
    next();
  } catch(err){
    return res.status(401).json({ message: 'Invalid/Expired token' });
  }
};
