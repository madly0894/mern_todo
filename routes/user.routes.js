const { Router } = require('express');
const router = Router();
const { body, validationResult, checkSchema } = require('express-validator');
const User = require('../models/User');
const validate = require('../middleware/validate.middleware');
const { cA, cB } = require('../utils');

router.get('/', async (req, res) => {
   try {
      const users = await User.find();
      res.status(200).json(users);
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.get('/:id', async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.post(
   '/add',
   validate([
      body('name').notEmpty().withMessage('Name field is required'),
      body('surname').notEmpty().withMessage('Surname field is required'),
      body('dateOfBirth')
         .isDate({ format: 'YYYY-MM-DD' })
         .withMessage('Invalid date format')
         .isBefore(cA)
         .withMessage('Your age must be over 18')
         .isAfter(cB)
         .withMessage('Your age must be under 35')
         .notEmpty()
         .withMessage('Date of birth field is required'),
   ]),
   async (req, res) => {
      try {
         const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth,
            age: +new Date().getFullYear() - +new Date(req.body.dateOfBirth).getFullYear(),
         });

         await user
            .save()
            .then(() => {
               res.status(200).json({ message: 'User successfully added' });
            })
            .catch(() => {
               res.status(500).json({ message: 'User not added' });
            });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   },
);

router.put(
   '/:id/edit',
   validate([
      body('name').notEmpty().withMessage('Name field is required'),
      body('surname').notEmpty().withMessage('Surname field is required'),
      body('dateOfBirth')
         .isDate({ format: 'YYYY-MM-DD' })
         .withMessage('Invalid date format')
         .isBefore(cA)
         .withMessage('Your age must be over 18')
         .isAfter(cB)
         .withMessage('Your age must be under 35')
         .notEmpty()
         .withMessage('Date of birth field is required'),
   ]),
   async (req, res) => {
      try {
         const user = await User.findById(req.params.id);

         await user
            .updateOne({
               name: req.body.name,
               surname: req.body.surname,
               dateOfBirth: req.body.dateOfBirth,
               age: +new Date().getFullYear() - +new Date(req.body.dateOfBirth).getFullYear(),
            })
            .then(() => {
               res.status(200).json({ message: 'User successfully updated' });
            })
            .catch(() => {
               res.status(500).json({ message: 'User not updated' });
            });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   },
);

router.delete('/:id/delete', async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      await user
         .deleteOne()
         .then(() => {
            res.status(200).json({ message: 'User successfully deleted' });
         })
         .catch(() => {
            res.status(500).json({ message: 'User not deleted' });
         });
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

module.exports = router;
