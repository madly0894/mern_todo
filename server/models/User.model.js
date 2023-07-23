const { Schema, model } = require('mongoose');

const schema = new Schema(
   {
      username: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      password: { type: String, required: true },
   },
   {
      timestamps: true,
   },
);

module.exports = model('User', schema);
