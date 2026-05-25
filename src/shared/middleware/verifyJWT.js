const jwt = require('jsonwebtoken');
const AppException = require('../exceptions/AppException');

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, code: 'TOKEN_MISSING', message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, code: 'TOKEN_EXPIRED', message: 'Token expirado' });
    }
    return res.status(401).json({ success: false, code: 'TOKEN_INVALID', message: 'Token inválido' });
  }
};

module.exports = verifyJWT;