const { Schema, model } = require('mongoose');

const schema = new Schema(
   {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      surname: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      age: { type: Number, min: 18, max: 45, required: true },
      picturePath: { type: String, default: null },
      patronymic: String,
   },
   {
      timestamps: true,
   },
);

module.exports = model('Employee', schema);
