const User = require('../models/User');
const UserDto = require('../dtos/user.dto');

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
}

module.exports = new UserController();
