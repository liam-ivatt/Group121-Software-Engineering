const mongoose = require('mongoose');

const WeightEntrySchema = new mongoose.Schema({
    weight: Number,
    date: { type: Date, default: Date.now }
});


const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  height: Number,
  weight: Number,
  bmi: Number,
  weightHistory: [WeightEntrySchema],
});

module.exports = mongoose.model('User', UserSchema);