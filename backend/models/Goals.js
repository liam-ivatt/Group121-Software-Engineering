const mongoose = require ('mongoose');

const goalsSchema = new mongoose.Schema({
    goalName: {type: String},
    targetWeight: {type: String},
    targetDate: {type: Date}
});

module.exports = { goalsSchema };