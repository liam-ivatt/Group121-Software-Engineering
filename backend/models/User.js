const mongoose = require('mongoose');
const { goalsSchema } = require('./Goals');

const WeightEntrySchema = new mongoose.Schema({
    weight: Number,
    date: { type: Date, default: Date.now }
});

const ExerciseEntrySchema = new mongoose.Schema({
    exercise: String,
    exerciseStat: Number,
    date: { type: String, default: Date.now }
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
  exerciseHistory: [ExerciseEntrySchema],
  goalsHistory: {type: [goalsSchema], default: []},
});

module.exports = mongoose.model('User', UserSchema);