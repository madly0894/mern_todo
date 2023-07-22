const UserModel = require('../models/User.model');
const UserDto = require('../dtos/user.dto');
const tokenService = require('../services/token.service');

class UserController {
   async getUser(req, res, next) {
      try {
         const user = await UserModel.findById(req.user.id);

         const userDto = new UserDto(user);

         res.status(200).json(userDto);
      } catch (e) {
         next(e);
      }
   }

   async deleteUser(req, res, next) {
      try {
         const accessToken = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

         await UserModel.deleteOne({ _id: req.user.id });

         await tokenService.removeToken(accessToken);

         res.status(200).json({ message: 'User successfully deleted' });
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new UserController();
