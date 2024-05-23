const Transaction = require('./Transaction');
const Group = require('./Group');
const User = require('./User');

async function getRecentActivities(userId) {
    const transactions = await Transaction.find({ 'payments.user_id': userId }).populate('group_id').populate('payee').sort({ date: -1 }).limit(25);
    return transactions.map(transaction => ({
        groupName: transaction.group_id.group_name,
        splitAmount: transaction.payments.find(payment => payment.user_id.toString() === userId.toString()).amount_paid,
        totalCost: transaction.total_cost,
        expenseName: transaction.name,
        paidBy: transaction.payee.username,
        paidFor: transaction.payments.map(payment => payment.user_id.toString() === userId.toString() ? 'You' : payment.user_id.username)
    }));
}

module.exports = {
    getRecentActivities
};



