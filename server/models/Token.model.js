const { Schema, model } = require('mongoose');

const schema = new Schema({
   userId: { type: Schema.Types.ObjectId, ref: 'User' },
   accessToken: { type: String, required: true },
});

module.exports = model('Token', schema);
