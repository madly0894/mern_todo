const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

module.exports = validations => async (req, res, next) => {
   for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
   }

   const errors = validationResult(req);

   if (errors.isEmpty()) {
      return next();
   }

   ApiError.BadRequest('Incorrect data', errors.array());
};
