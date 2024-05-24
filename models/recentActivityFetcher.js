const Transaction = require('./Transaction');
const Group = require('./Group');
const User = require('./User');

async function getRecentActivities(userId) {
    const transactions = await Transaction.find({ 'payments.user_id': userId })
        .populate({
            path: 'group_id',
            select: 'group_pic group_name members',
        })
        .populate('payee')
        .populate({
            path: 'payments.user_id',
            select: 'username',
        })
        .sort({ date: -1 })
        .limit(25);

    console.log(transactions);

    return transactions.map(transaction => {
        const userPayment = transaction.payments.find(payment => payment.user_id._id.toString() === userId.toString());
        let groupPic = null;

        if (transaction.group_id.group_pic && transaction.group_id.group_pic.data) {
            groupPic = `data:${transaction.group_id.group_pic.contentType};base64,${transaction.group_id.group_pic.data.toString('base64')}`;
        }

        return {
            groupPic: groupPic,
            groupName: transaction.group_id.group_name,
            splitAmount: userPayment ? userPayment.amount_paid : 0,
            totalCost: transaction.total_cost,
            expenseName: transaction.name,
            paidBy: transaction.payee.username,
            paidFor: transaction.payments.map(payment => payment.user_id._id.toString() === userId.toString() ? 'You' : payment.user_id.username),
        };
    });
}

module.exports = {
    getRecentActivities,
};
