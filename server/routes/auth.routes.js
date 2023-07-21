const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const {
   signInValidationSchema,
   signUpValidationSchema,
   signOutValidationSchema,
} = require('../helpers/validationUtils');

router.post('/sign-up', signUpValidationSchema, authController.signUp);
router.post('/sign-in', signInValidationSchema, authController.signIn);
router.post('/sign-out', signOutValidationSchema, authController.signOut);

module.exports = router;
