const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    total_cost: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    categories: [{ type: String }],
    payee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payments: [
        {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount_paid: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model('Transaction', transactionSchema);
  