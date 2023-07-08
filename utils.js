const validate = require('./middleware/validate.middleware');
const { body } = require('express-validator');

const getAge = date => new Date().getFullYear() - new Date(date).getFullYear();

const validateSchema = validate([
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
            throw new Error('Birth date must be between 18 and 35 years ago');
         }

         return true;
      })
      .notEmpty()
      .withMessage('Date of birth field is required'),
]);

module.exports = { validateSchema, getAge };
