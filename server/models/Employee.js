const { Schema, model } = require('mongoose');

const schema = new Schema({
   name: { type: String, required: true },
   surname: { type: String, required: true },
   dateOfBirth: { type: Date, required: true },
   age: { type: Number, min: 18 },
});

module.exports = model('Employee', schema);
