const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUser);
router.delete('/', userController.deleteUser);

module.exports = router;
