const User = require('../models/User');
const UserDto = require('../dtos/user.dto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

class AuthController {
   async signUp(req, res, next) {
      try {
         const { name, username, password } = req.body;

         const candidate = await User.findOne({ username });

         if (candidate) {
            return res.status(409).json({ message: 'Username already taken' });
         }

         const hashedPassword = await bcrypt.hash(password, 12);

         const user = await User.create({
            name,
            username,
            password: hashedPassword,
         });

         const userDto = new UserDto(user);

         const token = jwt.sign({ ...userDto }, process.env.JWT_SECRET, {
            expiresIn: '24h',
         });

         await Token.create({
            accessToken: token,
         });

         res.status(201).json({ token, message: 'You have successfully registered' });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async signIn(req, res, next) {
      try {
         const { username, password } = req.body;

         const user = await User.findOne({ username });

         if (!user) {
            return res.status(400).json({ message: 'User not found' });
         }

         const isMatch = await bcrypt.compare(password, user.password);

         if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password, please try again' });
         }

         const userDto = new UserDto(user);

         const token = jwt.sign({ ...userDto }, process.env.JWT_SECRET, {
            expiresIn: '24h',
         });

         await Token.create({
            accessToken: token,
         });

         res.status(200).json({ token, message: 'You have successfully logged in' });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async signOut(req, res, next) {
      try {
         const { accessToken } = req.body;

         await Token.deleteOne({ accessToken });

         res.status(200).json({ message: 'You have successfully logged out' });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }
}

module.exports = new AuthController();
