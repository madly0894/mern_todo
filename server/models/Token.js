const { Schema, model } = require('mongoose');

const schema = new Schema({
   accessToken: { type: String, required: true },
});

module.exports = model('Token', schema);
