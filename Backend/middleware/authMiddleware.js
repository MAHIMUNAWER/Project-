const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  // Accept token from Authorization header  OR  a cookie named "agri_token"
  let token =
    req.cookies?.agri_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;   // attach user id for downstream controllers
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
