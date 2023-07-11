const { Router } = require('express');
const router = Router();
const employeeController = require('../controllers/employee.controller');
const { employeeValidationSchema } = require('../validationUtils');

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/add', employeeValidationSchema, employeeController.createEmployee);
router.put('/:id/edit', employeeValidationSchema, employeeController.editEmployee);
router.delete('/:id/delete', employeeController.deleteEmployee);
router.delete('/delete', employeeController.deleteEmployees);

module.exports = router;
