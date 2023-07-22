const EmployeeModel = require('../models/Employee.model');
const EmployeeDto = require('../dtos/employee.dto');
const { getAge, deleteFile } = require('../helpers/utils');

class EmployeeController {
   async getEmployees(req, res, next) {
      try {
         const { page = 1, limit = 15 } = req.body;

         const totalItems = await EmployeeModel.countDocuments({ userId: req.user.id });
         const totalPages = Math.ceil(totalItems / limit);
         const skip = (page - 1) * limit;

         const employees = await EmployeeModel.find({ userId: req.user.id })
            .skip(skip)
            .limit(limit)
            .sort({ _id: 'desc' });

         res.status(200).json({
            data: employees.map(employee => ({
               ...new EmployeeDto(employee),
               picturePath: employee.picturePath ? `${process.env.API_URL}/images/${employee.picturePath}` : null,
            })),
            currentPage: page,
            totalPages,
            totalItems,
            hasNextPage: page < totalPages,
            nextPage: page + 1,
         });
      } catch (e) {
         next(e);
      }
   }

   async getEmployee(req, res, next) {
      try {
         const employee = await EmployeeModel.findById(req.params.id);

         const employeeDto = new EmployeeDto(employee);

         res.status(200).json(employeeDto);
      } catch (e) {
         next(e);
      }
   }

   async createEmployee(req, res, next) {
      try {
         const { name, surname, patronymic = '', dateOfBirth } = req.body;

         await EmployeeModel.create({
            userId: req.user.id,
            name,
            surname,
            patronymic,
            dateOfBirth,
            age: getAge(dateOfBirth),
            picturePath: req.file?.filename ?? null,
         });

         res.status(201).json({ message: 'Employee successfully added' });
      } catch (e) {
         next(e);
      }
   }

   async editEmployee(req, res, next) {
      try {
         const { name, surname, patronymic = '', dateOfBirth } = req.body;

         const employee = await EmployeeModel.findById(req.params.id);

         const picture = employee.picturePath;

         if (picture) {
            deleteFile(picture);
         }

         await EmployeeModel.updateOne(
            { _id: req.params.id },
            {
               name,
               surname,
               patronymic,
               dateOfBirth,
               age: getAge(dateOfBirth),
               picturePath: req.file?.filename ?? null,
            },
         );

         res.status(200).json({ message: 'Employee successfully updated' });
      } catch (e) {
         next(e);
      }
   }

   async deleteEmployee(req, res, next) {
      try {
         await EmployeeModel.deleteOne({ _id: req.params.id });

         res.status(200).json({ message: 'Employee successfully deleted' });
      } catch (e) {
         next(e);
      }
   }

   async deleteEmployees(req, res, next) {
      try {
         await EmployeeModel.deleteMany({ _id: { $in: req.query.ids } });

         res.status(200).json({ message: 'Users successfully deleted' });
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new EmployeeController();
