const validate = require('./middlewares/validate.middleware');
const { body } = require('express-validator');

const getAge = date => new Date().getFullYear() - new Date(date).getFullYear();

module.exports = { getAge };
