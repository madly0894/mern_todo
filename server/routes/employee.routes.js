const { Router } = require('express');
const router = Router();
const employeeController = require('../controllers/employee.controller');
const { employeeValidationSchema } = require('../helpers/validationSchemas');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/add', employeeValidationSchema, employeeController.createEmployee);
router.put('/:id/edit', employeeValidationSchema, employeeController.editEmployee);
router.delete('/:id/delete', employeeController.deleteEmployee);
router.delete('/delete', employeeController.deleteEmployees);
router.get('/:id/picture', employeeController.getEmployeePicture);
router.put('/:id/picture', uploadMiddleware.single('picture'), employeeController.uploadEmployeePicture);

module.exports = router;
