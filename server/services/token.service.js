const jwt = require('jsonwebtoken');
const TokenModel = require('../models/Token.model');

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '2w' });
      return {
         accessToken,
         refreshToken,
      };
   }

   validateAccessToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
         return userData;
      } catch (e) {
         return null;
      }
   }

   validateRefreshToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
         return userData;
      } catch (e) {
         return null;
      }
   }

   async saveToken(userId, refreshToken) {
      // const tokenData = await TokenModel.findOne({ userId });
      // if (tokenData) {
      //    tokenData.refreshToken = refreshToken;
      //    return tokenData.save();
      // }
      const tokens = await TokenModel.find({ userId });
      for (const token of tokens) {
         const decodedToken = this.validateRefreshToken(token.refreshToken);
         if (!decodedToken) {
            await TokenModel.deleteOne({ refreshToken: token.refreshToken });
         }
      }
      const token = await TokenModel.create({ userId, refreshToken });
      return token;
   }

   async removeToken(refreshToken) {
      const tokenData = await TokenModel.deleteOne({ refreshToken });
      return tokenData;
   }

   async findToken(refreshToken) {
      const tokenData = await TokenModel.findOne({ refreshToken });
      return tokenData;
   }
}

module.exports = new TokenService();
