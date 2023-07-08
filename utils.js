const validate = require('./middleware/validate.middleware');
const { body } = require('express-validator');
const getOwnYear = (count = 0) => {
   const date = new Date();
   const year = date.getFullYear();
   const month = date.getMonth();
   const day = date.getDate();
   return new Date(year - count, month, day).toDateString();
};

const validateSchema = validate([
   body('name').notEmpty().withMessage('Name field is required'),
   body('surname').notEmpty().withMessage('Surname field is required'),
   body('dateOfBirth')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Invalid date format')
      .isBefore(getOwnYear(18))
      .withMessage('Your age must be over 18')
      .isAfter(getOwnYear(35))
      .withMessage('Your age must be under 35')
      .notEmpty()
      .withMessage('Date of birth field is required'),
]);

module.exports = { getOwnYear, validateSchema };
