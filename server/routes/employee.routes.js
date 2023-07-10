const { Router } = require('express');
const router = Router();
const Employee = require('../models/Employee');
const { employeeValidationSchema } = require('../validationUtils');
const { getAge } = require('../utils');

router.get('/', async (req, res) => {
   try {
      const { page = 1, limit = 10 } = req.body;

      const totalItems = await Employee.countDocuments();
      const totalPages = Math.ceil(totalItems / limit);

      const skip = (page - 1) * limit;

      const employees = await Employee.find().skip(skip).limit(limit).sort({ id: 'desc' });

      res.status(200).json({
         data: employees,
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
      const employee = await Employee.findById(req.params.id);

      res.status(200).json(employee);
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.post('/add', employeeValidationSchema, async (req, res) => {
   try {
      const { name, surname, dateOfBirth } = req.body;

      await Employee.create({
         name,
         surname,
         dateOfBirth,
         age: getAge(dateOfBirth),
      });

      res.status(201).json({ message: 'Employee successfully added' });
   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.put('/:id/edit', employeeValidationSchema, async (req, res) => {
   try {
      const { name, surname, dateOfBirth } = req.body;

      const employee = await Employee.findById(req.params.id);

      await employee.updateOne({
         name,
         surname,
         dateOfBirth,
         age: getAge(dateOfBirth),
      });

      res.status(200).json({ message: 'Employee successfully updated' });
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.delete('/:id/delete', async (req, res) => {
   try {
      const employee = await Employee.findById(req.params.id);

      await employee.deleteOne();

      res.status(200).json({ message: 'Employee successfully deleted' });
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

router.delete('/delete', async (req, res) => {
   try {
      await Employee.deleteMany({ id: { $in: req.query.ids } });

      res.status(200).json({ message: 'Users successfully deleted' });
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong, please try again' });
   }
});

module.exports = router;
