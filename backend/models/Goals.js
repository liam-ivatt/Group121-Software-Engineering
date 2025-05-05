const mongoose = require ('mongoose');

const goalsSchema = new mongoose.Schema({
    goalName: {
        type: String,
        required: true
    },
    targetWeight: {
        type: String,
        required: true
    },
    targetDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Goals', goalsSchema);