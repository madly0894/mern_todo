const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

const userValidationSchema = validate([body('name').notEmpty().withMessage('Name field is required')]);

const employeeValidationSchema = validate([
   body('name').notEmpty().withMessage('Name field is required'),
   body('surname').notEmpty().withMessage('Surname field is required'),
   body('dateOfBirth')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Invalid date format')
      .custom(value => {
         const currentDate = new Date();
         const birthDate = new Date(value);
         const age = currentDate.getFullYear() - birthDate.getFullYear();

         if (
            age < 18 ||
            age > 35 ||
            (age === 18 && currentDate.getMonth() < birthDate.getMonth()) ||
            (age === 35 && currentDate.getMonth() > birthDate.getMonth()) ||
            (age === 18 &&
               currentDate.getMonth() === birthDate.getMonth() &&
               currentDate.getDate() < birthDate.getDate()) ||
            (age === 35 &&
               currentDate.getMonth() === birthDate.getMonth() &&
               currentDate.getDate() > birthDate.getDate())
         ) {
            throw new Error('Birth date must be between 18 and 45 years ago');
         }

         return true;
      })
      .notEmpty()
      .withMessage('Date of birth field is required'),
]);

const signUpValidationSchema = validate([
   body('name').notEmpty().withMessage('Name field is required'),
   body('username').notEmpty().withMessage('Username field is required').trim(),
   body('password')
      .notEmpty()
      .withMessage('Password field is required')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must contain at least 6 characters'),
   body('passwordConfirmation')
      .notEmpty()
      .withMessage('Password field is required')
      .trim()
      .custom((value, { req }) => value === req.body.password)
      .withMessage('The passwords do not match'),
]);

const signInValidationSchema = validate([
   body('username').notEmpty().withMessage('Username field is required'),
   body('password')
      .notEmpty()
      .withMessage('Password field is required')
      .isLength({ min: 6 })
      .withMessage('Password must contain at least 6 characters'),
]);

module.exports = { userValidationSchema, signInValidationSchema, signUpValidationSchema, employeeValidationSchema };
