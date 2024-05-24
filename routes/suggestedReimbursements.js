const express = require("express")
const router = express.Router()
const { ObjectId } = require('mongodb');
const Group = require('../models/Group');
const { get } = require("http");
const Transaction = require("../models/Transaction");

async function getGroupDebt(group, req) {
    let userOwesTo = {};

    group.members.forEach(member => {
        userOwesTo[member.user_id._id] = { amount: 0, name: member.user_id.username };
    });

    for (const transaction of group.transactions) {
        if (transaction.payee.equals(req.session.userId)) {
            transaction.payments.forEach(payment => {
                if (!payment.user_id.equals(req.session.userId) && userOwesTo[payment.user_id]) {
                    userOwesTo[payment.user_id].amount += payment.amount_paid;
                }
            });
        } else {
            const userPayment = transaction.payments.find(payment => payment.user_id.equals(req.session.userId));
            if (userPayment && userOwesTo[transaction.payee]) {
                userOwesTo[transaction.payee].amount -= userPayment.amount_paid;
            }
        }
    }

    console.log(userOwesTo);
    return userOwesTo;
}

router.get('/suggestedReimbursements', async (req, res) => {
    const groupId = new ObjectId(req.query.groupId);
    const group = await Group.findOne({ _id: groupId }).populate('transactions').populate({path: 'members.user_id', select: 'username'});
    console.log(group);
    const debtInGroup = await getGroupDebt(group, req);
    res.render('suggestedReimbursements', { path: '/groups', debtInGroup: debtInGroup, loggedUsername: req.session.username, groupId: groupId})
})

router.post('/reimburse', async (req, res) => {
    console.log(req.body);
    let groupId = new ObjectId(req.body.reimburseGroupId);
    let friendId = new ObjectId(req.body.reimburseFriendId);
    let amountTobePaid = parseFloat(req.body.reimburseAmount);
    let reimbursements = await Transaction.create({
        name: "Reimbursement",
        group_id: groupId,
        category: "miscellaneous",
        total_cost: amountTobePaid,
        payee: req.session.userId,
        payments: [{ user_id: friendId, amount_paid: amountTobePaid}]
    });
    await Group.updateOne({ _id: groupId }, { $push: { transactions: reimbursements._id } });
    console.log(reimbursements);
    res.redirect('/home')
})
module.exports = router