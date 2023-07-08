const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const { validateSchema, getAge } = require('../utils');

router.get('/', async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const totalItems = await User.countDocuments();
      const totalPages = Math.ceil(totalItems / limit);

      const skip = (page - 1) * limit;

      const users = await User.find().skip(skip).limit(limit).sort({ _id: 'desc' });

      res.status(200).json({
         data: users,
         currentPage: page,
         totalPages,
         totalItems,
         hasNextPage: page < totalPages,
         nextPage: page + 1,
      });
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

router.post('/add', validateSchema, async (req, res) => {
   try {
      const user = new User({
         name: req.body.name,
         surname: req.body.surname,
         dateOfBirth: req.body.dateOfBirth,
         age: getAge(req.body.dateOfBirth),
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
});

router.put('/:id/edit', validateSchema, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      await user
         .updateOne({
            name: req.body.name,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth,
            age: getAge(req.body.dateOfBirth),
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
});

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

router.delete('/delete', async (req, res) => {
   try {
      await User.deleteMany({ _id: { $in: req.query.ids } })
         .then(() => {
            res.status(200).json({ message: 'Users successfully deleted' });
         })
         .catch(() => {
            res.status(500).json({ message: 'Users not deleted' });
         });
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

module.exports = router;
