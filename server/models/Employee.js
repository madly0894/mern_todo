const { Schema, model } = require('mongoose');

const schema = new Schema({
   username: { type: String, required: true },
   name: { type: String, required: true },
   surname: { type: String, required: true },
   patronymic: { type: String },
   dateOfBirth: { type: Date, required: true },
   age: { type: Number, min: 18, required: true },
});

module.exports = model('Employee', schema);
