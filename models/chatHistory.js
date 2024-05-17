const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chatHistory: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'chathistories' });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
