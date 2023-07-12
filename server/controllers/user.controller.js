const User = require('../models/User');
const UserDto = require('../dtos/user.dto');
const Token = require('../models/Token');

class UserController {
   async getUser(req, res) {
      try {
         const user = await User.findById(req.user.id);

         const userDto = new UserDto(user);

         res.status(200).json(userDto);
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async deleteUser(req, res) {
      try {
         const accessToken = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

         await User.deleteOne({ _id: req.user.id });

         await Token.deleteOne({ accessToken });

         res.status(200).json({ message: 'User successfully deleted' });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }
}

module.exports = new UserController();
