const UserModel = require('../models/User.model');
const UserDto = require('../dtos/user.dto');
const tokenService = require('../services/token.service');

class UserController {
   async getUsers(req, res, next) {
      try {
         const users = await UserModel.find();
         return res.json(users);
      } catch (e) {
         next(e);
      }
   }

   async getUser(req, res, next) {
      try {
         const user = await UserModel.findById(req.user.id);
         const userDto = new UserDto(user);
         return res.status(200).json(userDto);
      } catch (e) {
         next(e);
      }
   }

   async deleteUser(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         await UserModel.deleteOne({ _id: req.user.id });
         await tokenService.removeToken(refreshToken);
         res.clearCookie('refreshToken');
         return res.status(200).json({ message: 'User successfully deleted' });
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new UserController();
