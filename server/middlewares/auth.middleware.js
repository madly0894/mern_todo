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
         return next(ApiError.UnauthorizedError('A access token is required for authentication'));
      }

      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
         return next(ApiError.UnauthorizedError('Access token is expired'));
      }

      req.user = userData;
      next();
   } catch {
      return next(ApiError.UnauthorizedError());
   }
};
