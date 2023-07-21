const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
      const accessToken = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

      if (!accessToken) {
         return res.status(403).json({ message: 'A accessToken is required for authentication' });
      }

      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

      req.user = decodedToken;

      next();
   } catch {
      res.status(401).json({ message: 'Invalid Token' });
   }
};
