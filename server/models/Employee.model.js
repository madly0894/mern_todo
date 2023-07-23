const { Schema, model } = require('mongoose');

const schema = new Schema({
   userId: { type: Schema.Types.ObjectId, ref: 'User' },
   name: { type: String, required: true },
   surname: { type: String, required: true },
   dateOfBirth: { type: Date, required: true },
   age: { type: Number, min: 18, max: 35, required: true },
   patronymic: String,
   picturePath: String,
});

module.exports = model('Employee', schema);
