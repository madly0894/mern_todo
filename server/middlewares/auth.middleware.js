const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

      if (!token) {
         return res.status(403).json({ message: 'A token is required for authentication' });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;

      next();
   } catch {
      res.status(401).json({ message: 'Invalid Token' });
   }
};
