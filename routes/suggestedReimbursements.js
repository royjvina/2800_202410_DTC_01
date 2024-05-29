const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');
const Group = require('../models/Group');
const Transaction = require("../models/Transaction");
const { debtInGroup } = require("../controllers/groupController");

/**
 * Route to get the suggested reimbursements for a group
 * @name get/suggestedReimbursements
 * @function
 * @memberof module:routers/reimbursement
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/suggestedReimbursements', async (req, res) => {
    try {
        const groupId = new ObjectId(req.query.groupId);
        const group = await Group.findOne({ _id: groupId })
            .populate('transactions')
            .populate({ path: 'members.user_id', select: 'username' }); // Finds the group with the given ID and populates transactions and members of the group
        
        const debtsInGroup = await debtInGroup(group, req); // Gets the debts in the group
        
        res.render('suggestedReimbursements', {
            path: '/groups',
            debtInGroup: debtsInGroup,
            loggedUsername: req.session.username,
            groupId: groupId
        });
    } catch (error) {
        console.error('Error fetching suggested reimbursements:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Post route to reimburse a friend
 * @name post/reimburse
 * @function
 * @memberof module:routers/reimbursement
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/reimburse', async (req, res) => {
    try {
        const groupId = new ObjectId(req.body.reimburseGroupId);
        const friendId = new ObjectId(req.body.reimburseFriendId);
        const amountTobePaid = parseFloat(req.body.reimburseAmount);

        const reimbursements = await Transaction.create({
            name: "Reimbursement",
            group_id: groupId,
            category: "reimbursement",
            total_cost: amountTobePaid,
            payee: req.session.userId,
            payments: [{ user_id: friendId, amount_paid: amountTobePaid }]
        }); // Creates a reimbursement transaction

        await Group.updateOne({ _id: groupId }, { $push: { transactions: reimbursements._id } }); // Pushes the transaction to the group
        
        res.redirect('/home');
    } catch (error) {
        console.error('Error processing reimbursement:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
