const UserModel = require('../models/User.model');
const UserDto = require('../dtos/user.dto');
const tokenService = require('../services/token.service');
const ApiError = require('../exceptions/api-error');
const Utils = require('../helpers/utils');
const EmployeeModel = require('../models/Employee.model');

class UserController {
   async getUser(req, res, next) {
      try {
         const user = await UserModel.findById(req.user.id);
         const userData = { ...new UserDto(user), picturePath: Utils.setImageUrl(user.picturePath) };
         return res.status(200).json(userData);
      } catch (e) {
         next(e);
      }
   }

   async updateUser(req, res, next) {
      try {
         await UserModel.updateOne(
            { _id: req.user.id },
            {
               name: req.body.name,
            },
         );
         return res.status(200).json({ message: 'User successfully updated' });
      } catch (e) {
         next(e);
      }
   }

   async uploadUserPicture(req, res, next) {
      try {
         const user = await UserModel.findById(req.user.id);
         await UserModel.updateOne(
            { _id: req.user.id },
            {
               picturePath: req.file.filename,
            },
         );
         const picturePath = user?.picturePath;
         if (!!picturePath) {
            Utils.deleteFile(picturePath);
         }
         return res.status(200).json({ message: 'User picture successfully updated' });
      } catch (e) {
         next(e);
      }
   }

   async deleteUser(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         if (!refreshToken) {
            throw ApiError.UnauthorizedError('A refresh token is required for refreshing');
         }
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
