const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  height: Number,
  weight: Number,
  bmi: Number
});

module.exports = mongoose.model('User', UserSchema);