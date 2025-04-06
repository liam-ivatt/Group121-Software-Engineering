const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  height: Number,
  weight: Number,
  bmi: Number
});

module.exports = mongoose.model('User', UserSchema);