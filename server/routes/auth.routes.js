const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signInValidationSchema, signUpValidationSchema } = require('../validationUtils');

router.post('/sign-up', signUpValidationSchema, async (req, res) => {
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

      const token = jwt.sign({ userId: user.id, name: user.name, username: user.username }, process.env.JWT_SECRET, {
         expiresIn: '24h',
      });

      res.status(201).json({ token, message: 'You have successfully registered' });
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.post('/sign-in', signInValidationSchema, async (req, res) => {
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

      const token = jwt.sign({ userId: user.id, name: user.name, username: user.username }, process.env.JWT_SECRET, {
         expiresIn: '24h',
      });

      res.status(200).json({ token, message: 'You have successfully logged in' });
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

module.exports = router;
