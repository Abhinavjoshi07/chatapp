const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: {
        type: String
    },
    receiver: {
        type: String
    },
    message: {
        type: String
    }
}, {
    timestamps: true // Enable timestamps
});

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;
