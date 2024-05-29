const express = require("express");
const router = express.Router();
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

/**
 * Route for rendering the add expenses page
 * @name get/addExpenses
 * @function
 * @memberof module:routers/expenses
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/addExpenses', async (req, res) => {
    try {
        let transactionId = req.query.expenseId;
        let transaction = await Transaction.findOne({ _id: transactionId })
            .populate({ path: 'group_id', select: 'group_name members' })
            .populate({ path: 'payee', select: 'username' })
            .populate('payments')
            .populate({ path: 'group_id', populate: { path: 'members.user_id' } });

        // Retrieve groups data for the current user
        let groups = await Group.find({ 'members.user_id': req.session.userId }).populate('members.user_id');

        // Process group data, if needed
        groups.forEach(group => {
            if (group.group_pic && group.group_pic.data) {
                group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
            }
            group.members.forEach(member => {
                if (member.user_id.profileImage && member.user_id.profileImage.data) {
                    member.user_id.profileImageBase64 = `data:${member.user_id.profileImage.contentType};base64,${member.user_id.profileImage.data.toString('base64')}`;
                }
            });
        });

        // Render the add expenses page with groups data
        res.render('addExpenses', { path: req.path, groups: groups, transaction: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Route for handling form submission to add expenses
 * @name post/addExpenses
 * @function
 * @memberof module:routers/expenses
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/addExpenses', async (req, res) => {
    try {
        // Extract form data
        const { selectedGroup, selectedDate, selectedExpenseName, selectedExpenseAmount, selectedCategory, selectedPaidBy } = req.body;

        // Get group by ID to check if it exists
        let groupId = new ObjectId(req.body.selectedGroup);
        const group = await Group.findOne({ _id: groupId });

        if (!group) {
            return res.status(400).json({ error: 'Group not found' });
        }

        // Prepare payment data
        const payments = [];
        let hasNonEmptyPayment = false;

        group.members.forEach(member => {
            let paymentValue = 0;
            let paymentPercentName = group._id + member.user_id._id + "AmountPercentage";
            let paymentEqualName = group._id + member.user_id._id + "AmountEqual";
            let paymentManualName = group._id + member.user_id._id + "AmountManual";
            let paymentPercent = req.body[paymentPercentName];
            let paymentEqual = req.body[paymentEqualName];
            let paymentManual = req.body[paymentManualName];

            if (paymentPercent && paymentPercent.trim() !== "") {
                paymentValue = parseFloat(paymentPercent);
                hasNonEmptyPayment = true;
            } else if (paymentEqual && paymentEqual.trim() !== "") {
                paymentValue = parseFloat(paymentEqual);
                hasNonEmptyPayment = true;
            } else if (paymentManual && paymentManual.trim() !== "") {
                paymentValue = parseFloat(paymentManual);
                hasNonEmptyPayment = true;
            }

            payments.push({
                user_id: member.user_id._id,
                amount_paid: paymentValue || 0 // Default to 0 if no payment value
            });
        });

        if (hasNonEmptyPayment) {
            // Create new transaction
            const newTransaction = new Transaction({
                name: selectedExpenseName,
                group_id: group._id,
                category: selectedCategory,
                total_cost: selectedExpenseAmount,
                date: selectedDate,
                payee: selectedPaidBy,
                payments: payments
            });

            // Save transaction
            await newTransaction.save();
            await Group.updateOne({ _id: group._id }, { $push: { transactions: newTransaction._id } });
            res.redirect('/home');
        } else {
            res.status(400).json({ error: 'No valid payment values provided' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
