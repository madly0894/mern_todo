const jwt = require('jsonwebtoken');
const TokenModel = require('../models/Token.model');

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
      return {
         accessToken,
         // refreshToken
      };
   }

   verifyAccessToken(accessToken) {
      try {
         const userData = jwt.verify(accessToken, process.env.JWT_SECRET);
         return userData;
      } catch (e) {
         return null;
      }
   }

   async saveToken(userId, accessToken) {
      const tokens = await TokenModel.find({ userId });

      for (const token of tokens) {
         const decodedToken = this.verifyAccessToken(token.accessToken);

         if (!decodedToken) {
            await TokenModel.deleteOne({ accessToken: token.accessToken });
         }
      }

      const token = await TokenModel.create({ userId, accessToken });
      return token;
   }

   async removeToken(accessToken) {
      const tokenData = await TokenModel.deleteOne({ accessToken });
      return tokenData;
   }

   async findToken(accessToken) {
      const tokenData = await TokenModel.findOne({ accessToken });
      return tokenData;
   }
}

module.exports = new TokenService();
