const EmployeeModel = require('../models/Employee.model');
const EmployeeDto = require('../dtos/employee.dto');
const Utils = require('../helpers/utils');

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
         const employeesData = employees.map(employee => ({
            ...new EmployeeDto(employee),
            picturePath: Utils.setImageUrl(employee.picturePath),
         }));
         return res.status(200).json({
            data: employeesData,
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
         const employeeData = new EmployeeDto(employee);
         return res.status(200).json(employeeData);
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
            age: Utils.getAge(dateOfBirth),
            picturePath: req.file?.filename ?? null,
         });
         return res.status(201).json({ message: 'Employee successfully added' });
      } catch (e) {
         next(e);
      }
   }

   async editEmployee(req, res, next) {
      try {
         const { name, surname, patronymic = '', dateOfBirth } = req.body;
         await EmployeeModel.updateOne(
            { _id: req.params.id },
            {
               name,
               surname,
               patronymic,
               dateOfBirth,
               age: Utils.getAge(dateOfBirth),
            },
         );
         return res.status(200).json({ message: 'Employee successfully updated' });
      } catch (e) {
         next(e);
      }
   }

   async getEmployeePicture(req, res, next) {
      try {
         const employee = await EmployeeModel.findById(req.params.id);
         const employeeData = {
            picturePath: Utils.setImageUrl(employee.picturePath),
         };
         return res.status(200).json(employeeData);
      } catch (e) {
         next(e);
      }
   }

   async uploadEmployeePicture(req, res, next) {
      try {
         const employee = await EmployeeModel.findById(req.params.id);
         await EmployeeModel.updateOne(
            { _id: req.params.id },
            {
               picturePath: req.file.filename,
            },
         );
         const picturePath = employee?.picturePath;
         if (!!picturePath) {
            Utils.deleteFile(picturePath);
         }
         return res.status(200).json({ message: 'Employee picture successfully updated' });
      } catch (e) {
         next(e);
      }
   }

   async deleteEmployee(req, res, next) {
      try {
         const employee = await EmployeeModel.findById(req.params.id);
         await EmployeeModel.deleteOne({ _id: req.params.id });
         const picturePath = employee?.picturePath;
         if (!!picturePath) {
            Utils.deleteFile(picturePath);
         }
         return res.status(200).json({ message: 'Employee successfully deleted' });
      } catch (e) {
         next(e);
      }
   }

   async deleteEmployees(req, res, next) {
      try {
         const employees = await EmployeeModel.find({ userId: req.user.id });
         await EmployeeModel.deleteMany({ _id: { $in: req.query.ids } });
         employees.forEach(employee => {
            const picturePath = employee?.picturePath;
            if (!!picturePath) {
               Utils.deleteFile(picturePath);
            }
         });
         return res.status(200).json({ message: 'Users successfully deleted' });
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new EmployeeController();
