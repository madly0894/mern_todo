const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token.service');

module.exports = (req, res, next) => {
   try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
         return next(ApiError.UnauthorizedError());
      }

      const accessToken = authorizationHeader.split(' ')[1]; // "Bearer TOKEN"

      if (!accessToken) {
         return next(ApiError.UnauthorizedError('A accessToken is required for authentication'));
      }

      const decodedToken = tokenService.verifyAccessToken(accessToken);

      if (!decodedToken) {
         return next(ApiError.UnauthorizedError('Token is expired'));
      }

      req.user = decodedToken;
      next();
   } catch {
      return next(ApiError.UnauthorizedError());
   }
};
