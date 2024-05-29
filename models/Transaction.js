const mongoose = require('mongoose');

/**
 * Schema for storing transaction information
 * @type {mongoose.Schema}
 */
const transactionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    group_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group', 
        required: true 
    },
    total_cost: { 
        type: Number, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    category: { 
        type: String 
    },
    payee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    payments: [
        {
            user_id: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true 
            },
            amount_paid: { 
                type: Number, 
                required: true 
            }
        }
    ]
});

/**
 * Transaction model
 * @typedef {Object} Transaction
 * @property {string} name - The name of the transaction
 * @property {mongoose.ObjectId} group_id - The ID of the group associated with the transaction
 * @property {number} total_cost - The total cost of the transaction
 * @property {Date} date - The date when the transaction was created
 * @property {string} category - The category of the transaction
 * @property {mongoose.ObjectId} payee - The ID of the user who paid for the transaction
 * @property {Array<Object>} payments - Array of payment objects
 * @property {mongoose.ObjectId} payments.user_id - The ID of the user who made the payment
 * @property {number} payments.amount_paid - The amount paid by the user
 */
module.exports = mongoose.model('Transaction', transactionSchema);
