const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const { signInValidationSchema, signUpValidationSchema } = require('../helpers/validationSchemas');

router.post('/sign-up', signUpValidationSchema, authController.signUp);
router.post('/sign-in', signInValidationSchema, authController.signIn);
router.post('/sign-out', authController.signOut);
router.get('/refresh', authController.refresh);

module.exports = router;
