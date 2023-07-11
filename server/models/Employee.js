const { Schema, model } = require('mongoose');

const schema = new Schema({
   userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
   name: { type: String, required: true },
   surname: { type: String, required: true },
   patronymic: { type: String },
   dateOfBirth: { type: Date, required: true },
   age: { type: Number, min: 18, max: 35, required: true },
});

module.exports = model('Employee', schema);
