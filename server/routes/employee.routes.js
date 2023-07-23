const { Router } = require('express');
const router = Router();
const employeeController = require('../controllers/employee.controller');
const { employeeValidationSchema } = require('../helpers/validationSchemas');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/add', uploadMiddleware.single('picture'), employeeValidationSchema, employeeController.createEmployee);
router.put('/:id/edit', uploadMiddleware.single('picture'), employeeValidationSchema, employeeController.editEmployee);
router.delete('/:id/delete', employeeController.deleteEmployee);
router.delete('/delete', employeeController.deleteEmployees);

module.exports = router;
