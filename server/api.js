const express = require('express');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

app.use('/auth', require('./routes/auth.routes'));
app.use('/user', authMiddleware, require('./routes/user.routes'));
app.use('/employees', authMiddleware, require('./routes/employee.routes'));

module.exports = app;
