const express = require("express");
const router = express.Router();
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

/**
 * Route for rendering the add expenses page
 * @name get/editExpenses
 * @function
 * @memberof module:routers/expenses
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/editExpenses', async (req, res) => {
    try {
        let transactionId = req.query.expenseId;
        let transaction = await Transaction.findOne({ _id: transactionId });
        let groupId = transaction.group_id;
        let group = await Group.findById(groupId).populate('members.user_id');

        // Process group data, if needed

        if (group.group_pic && group.group_pic.data) {
            group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
        }
        group.members.forEach(member => {
            if (member.user_id.profileImage && member.user_id.profileImage.data) {
                member.user_id.profileImageBase64 = `data:${member.user_id.profileImage.contentType};base64,${member.user_id.profileImage.data.toString('base64')}`;
            }
        });


        // Render the add expenses page with groups data
        res.render('editExpense', { path: '', group: group, transaction: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Route for updating the expense
 * @name post/editExpense
 * @function
 * @memberof module:routers/expenses
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/editExpense', async (req, res) => {
    try {
        console.log("Redirecting to /home");
        const formObject = req.body;
        let modifiedFormObject = {};
        for (let key in formObject) {
            if (formObject[key] !== "$0.00" && formObject[key] !== "0.00" && formObject[key] !== "") {
                console.log(formObject[key]);
                let newKey = key;
                if (key.includes(`Amount${formObject.splitType}`) || key.includes(`Percentage`)) {
                    newKey = key.replace(`Amount${formObject.splitType}`, '').replace(`Percentage`, '').replace(formObject.groupId, '');
                }
                if (key != 'userEqualSplit') {
                    modifiedFormObject[newKey] = formObject[key];
                }
            }
        }
        const { selectedExpenseName, expenseId, selectedExpenseAmount, selectedDate, selectedCategory, selectedPaidBy, splitType, groupId, ...splitData } = modifiedFormObject
        const payments = Object.keys(splitData).map(userId => {
            return {
                user_id: userId,
                amount_paid: parseFloat(splitData[userId].replace('$', ''))
            };
        });
        await Transaction.findOneAndUpdate(
            { _id: expenseId },
            {
                name: selectedExpenseName.trim(),
                total_cost: parseFloat(selectedExpenseAmount),
                date: new Date(selectedDate),
                category: selectedCategory,
                payee: selectedPaidBy,
                payments: payments,
                group_id: groupId,
            },
            { new: true }
        );
        res.redirect('/home');


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
