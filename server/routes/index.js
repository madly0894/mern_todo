const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');

const app = express();

app.use('/auth', require('./auth.routes'));
app.use('/user', authMiddleware, require('./user.routes'));
app.use('/employees', authMiddleware, require('./employee.routes'));

module.exports = app;
