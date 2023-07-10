const { Router } = require('express');
const router = Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
   try {
      const user = await User.findById(req.user.uid);

      const newData = {
         name: user.name,
         username: user.username,
         uid: user._id,
      };

      res.status(200).json(newData);
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

module.exports = router;
