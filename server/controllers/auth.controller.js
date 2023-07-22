const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token.service');

class AuthController {
   async signUp(req, res, next) {
      try {
         const { name, username, password } = req.body;
         const candidate = await UserModel.findOne({ username });
         if (candidate) {
            throw ApiError.BadRequest('Username already taken');
         }
         const hashedPassword = await bcrypt.hash(password, 12);
         const user = await UserModel.create({
            name,
            username,
            password: hashedPassword,
         });
         const userDto = new UserDto(user);
         const userData = tokenService.generateTokens({ ...userDto });
         await tokenService.saveToken(userDto.id, userData.refreshToken);
         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
         return res.status(201).json({ ...userData, message: 'You have successfully registered' });
      } catch (e) {
         next(e);
      }
   }

   async signIn(req, res, next) {
      try {
         const { username, password } = req.body;
         const user = await UserModel.findOne({ username });
         if (!user) {
            throw ApiError.BadRequest('User not found');
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            throw ApiError.BadRequest('Wrong password, please try again');
         }
         const userDto = new UserDto(user);
         const userData = tokenService.generateTokens({ ...userDto });
         await tokenService.saveToken(userDto.id, userData.refreshToken);
         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
         return res.status(200).json({ ...userData, message: 'You have successfully logged in' });
      } catch (e) {
         next(e);
      }
   }

   async signOut(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         await tokenService.removeToken(refreshToken);
         res.clearCookie('refreshToken');
         return res.status(200).json({ message: 'You have successfully logged out' });
      } catch (e) {
         next(e);
      }
   }

   async refresh(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         if (!refreshToken) {
            throw ApiError.UnauthorizedError('A refresh token is required for refreshing');
         }
         const userData = tokenService.validateRefreshToken(refreshToken);
         const tokenFromDb = await tokenService.findToken(refreshToken);
         if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError('Refresh token is expired');
         }
         const user = await UserModel.findById(userData.id);
         const userDto = new UserDto(user);
         const tokens = tokenService.generateTokens({ ...userDto });
         await tokenService.saveToken(userDto.id, tokens.refreshToken);
         res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
         return res.json(tokens);
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new AuthController();
