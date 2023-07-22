const UserModel = require('../models/User.model');
const UserDto = require('../dtos/user.dto');
const bcrypt = require('bcryptjs');
const tokenService = require('../services/token.service');

class AuthController {
   async signUp(req, res, next) {
      try {
         const { name, username, password } = req.body;

         const candidate = await UserModel.findOne({ username });

         if (candidate) {
            return res.status(409).json({ message: 'Username already taken' });
         }

         const hashedPassword = await bcrypt.hash(password, 12);

         const user = await UserModel.create({
            name,
            username,
            password: hashedPassword,
         });

         const userDto = new UserDto(user);

         const { accessToken } = tokenService.generateTokens({ ...userDto });

         await tokenService.saveToken(userDto.id, accessToken);

         res.status(201).json({ accessToken, message: 'You have successfully registered' });
      } catch (e) {
         next(e);
      }
   }

   async signIn(req, res, next) {
      try {
         const { username, password } = req.body;

         const user = await UserModel.findOne({ username });

         if (!user) {
            return res.status(400).json({ message: 'User not found' });
         }

         const isMatch = await bcrypt.compare(password, user.password);

         if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password, please try again' });
         }

         const userDto = new UserDto(user);

         const { accessToken } = tokenService.generateTokens({ ...userDto });

         await tokenService.saveToken(userDto.id, accessToken);

         res.status(200).json({ accessToken, message: 'You have successfully logged in' });
      } catch (e) {
         next(e);
      }
   }

   async signOut(req, res, next) {
      try {
         const { accessToken } = req.body;

         await tokenService.removeToken(accessToken);

         res.status(200).json({ message: 'You have successfully logged out' });
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new AuthController();
