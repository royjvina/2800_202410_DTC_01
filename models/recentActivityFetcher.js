const Transaction = require('./Transaction');
const Group = require('./Group');
const User = require('./User');

async function getRecentActivities(userId) {
    const transactions = await Transaction.find({ 'payments.user_id': userId }).populate({path: 'group_id', select: 'group_pic', select: 'members', select: 'group_name'}).populate('payee').sort({ date: -1 }).limit(25);
    console.log(transactions)
    return transactions.map(transaction => ({
        groupPic: transaction.group_id.group_pic,
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



