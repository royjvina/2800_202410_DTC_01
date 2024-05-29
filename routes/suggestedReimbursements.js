const express = require("express")
const router = express.Router()
const { ObjectId } = require('mongodb');
const Group = require('../models/Group');
const { get } = require("http");
const Transaction = require("../models/Transaction");
const { debtInGroup } = require("../controllers/groupController");

// Route to get the suggested reimbursements
router.get('/suggestedReimbursements', async (req, res) => {
    const groupId = new ObjectId(req.query.groupId);
    const group = await Group.findOne({ _id: groupId }).populate('transactions').populate({path: 'members.user_id', select: 'username'});//finds the group with the given id and populates the transactions and members of the group
    const debtsInGroup = await debtInGroup(group, req);//gets the debts in the group
    res.render('suggestedReimbursements', { path: '/groups', debtInGroup: debtsInGroup, loggedUsername: req.session.username, groupId: groupId})
})

// Post route to reimburse the friend
router.post('/reimburse', async (req, res) => {
    let groupId = new ObjectId(req.body.reimburseGroupId);
    let friendId = new ObjectId(req.body.reimburseFriendId);
    let amountTobePaid = parseFloat(req.body.reimburseAmount);
    let reimbursements = await Transaction.create({//creates a reimbursement transaction
        name: "Reimbursement",
        group_id: groupId,
        category: "miscellaneous",
        total_cost: amountTobePaid,
        payee: req.session.userId,
        payments: [{ user_id: friendId, amount_paid: amountTobePaid}]
    });
    await Group.updateOne({ _id: groupId }, { $push: { transactions: reimbursements._id } });//pushes the transaction to the group
    res.redirect('/home')
})
module.exports = router