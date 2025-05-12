const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: String,
    groupOwner: {type: mongoose.Schema.ObjectId, ref: 'User'},
    groupMembers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    joinCode: { type: String, unique: true },
});

module.exports = mongoose.model('Group', GroupSchema);