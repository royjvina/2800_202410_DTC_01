const express = require("express");
const router = express.Router();
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Route for rendering the add expenses page
router.get('/addExpenses', async (req, res) => {
    try {
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
        res.render('addExpenses', { path: req.path, groups: groups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for handling form submission to add expenses
router.post('/addExpenses', async (req, res) => {
    try {
        
        // Extract form data
        const { selectedGroup, selectedDate, selectedExpenseName, selectedExpenseAmount, selectedCategory, selectedPaidBy, } = req.body;
        console.log(req.body);
        // Get group by ID to check if it exists
        let groupsData = await Group.find({ 'members.user_id': req.session.userId }).populate('members.user_id');
        let groupId = new ObjectId(req.body.selectedGroup);
        const group = await Group.findOne({ _id: groupId });

        if (!group) {
            return res.status(400).json({ error: 'Group not found' });
        }

        // Prepare payment data
        const payments = [];
        group.members.forEach(member => {
            paymentName = group._id + member.user_id._id +"AmountEqual";
            if (req.body[paymentName]) {
                paymentValue = req.body[paymentName];
                console.log(paymentValue)
                payments.push({
                    user_id: member.user_id._id,
                    amount_paid: paymentValue
                });
            }
        });

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

        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
