const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schema for storing chat history for users
 * @type {mongoose.Schema}
 */
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

/**
 * ChatHistory model
 * @typedef {Object} ChatHistory
 * @property {mongoose.ObjectId} userId - The ID of the user
 * @property {Array<Object>} chatHistory - Array of chat history objects
 * @property {string} chatHistory.question - The question asked in the chat
 * @property {string} chatHistory.answer - The answer provided in the chat
 * @property {Date} date - The date when the chat history was recorded
 */
module.exports = mongoose.model('ChatHistory', chatHistorySchema);
