const Employee = require('../models/Employee');
const UserDto = require('../dtos/user.dto');
const EmployeeDto = require('../dtos/employee.dto');
const { getAge } = require('../utils');

class EmployeeController {
   async getEmployees(req, res) {
      try {
         const { page = 1, limit = 15 } = req.body;

         const totalItems = await Employee.countDocuments({ userId: req.user.id });
         const totalPages = Math.ceil(totalItems / limit);

         const skip = (page - 1) * limit;

         const employees = await Employee.find({ userId: req.user.id })
            .skip(skip)
            .limit(limit)
            .sort({ _id: 'desc' })
            .populate('userId');

         res.status(200).json({
            data: employees.map(employee => ({
               ...new EmployeeDto(employee),
               userId: employee.userId._id,
               user: new UserDto(employee.userId),
            })),
            currentPage: page,
            totalPages,
            totalItems,
            hasNextPage: page < totalPages,
            nextPage: page + 1,
         });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async getEmployee(req, res) {
      try {
         const employee = await Employee.findById(req.params.id);

         const employeeDto = new EmployeeDto(employee);

         res.status(200).json(employeeDto);
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async createEmployee(req, res) {
      try {
         const { name, surname, patronymic = '', secretWord = '', dateOfBirth } = req.body;

         await Employee.create({
            userId: req.user.id,
            name,
            surname,
            patronymic,
            secretWord,
            dateOfBirth,
            age: getAge(dateOfBirth),
         });

         res.status(201).json({ message: 'Employee successfully added' });
      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async editEmployee(req, res) {
      try {
         const { name, surname, patronymic = '', secretWord = '', dateOfBirth } = req.body;

         await Employee.updateOne(
            { _id: req.params.id },
            {
               name,
               surname,
               patronymic,
               secretWord,
               dateOfBirth,
               age: getAge(dateOfBirth),
            },
         );

         res.status(200).json({ message: 'Employee successfully updated' });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async deleteEmployee(req, res) {
      try {
         await Employee.deleteOne({ _id: req.params.id });

         res.status(200).json({ message: 'Employee successfully deleted' });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }

   async deleteEmployees(req, res) {
      try {
         await Employee.deleteMany({ _id: { $in: req.query.ids } });

         res.status(200).json({ message: 'Users successfully deleted' });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong, please try again' });
      }
   }
}

module.exports = new EmployeeController();
