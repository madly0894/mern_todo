const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { userValidationSchema } = require('../helpers/validationSchemas');

router.get('/', userController.getUser);
router.put('/update', userValidationSchema, userController.updateUser);
router.put('/picture', uploadMiddleware.single('picture'), userController.uploadUserPicture);
router.delete('/delete', userController.deleteUser);

module.exports = router;
