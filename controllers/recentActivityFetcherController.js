const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const User = require('../models/User');

/**
 * Function to get recent activities for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - A promise that resolves to an array of recent activity objects
 * @async
 * @example
 * // Get recent activities for user '12345'
 * getRecentActivities('12345').then(activities => console.log(activities));
 */
async function getRecentActivities(userId) {
    // Fetch transactions where the user is involved
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

    // Map transactions to a more user-friendly format
    return transactions.map(transaction => {
        const userPayment = transaction.payments.find(payment => payment.user_id._id.toString() === userId.toString());
        let groupPic = null;

        // Convert group picture to base64 format if it exists
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
            date: transaction.date
        };
    });
}

module.exports = {
    getRecentActivities,
};
