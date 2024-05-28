const express = require("express")
const router = express.Router()
const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const { ObjectId } = require('mongodb');

router.get('/individualExpense', async (req, res) => {
    let userId = req.session.userId;
    let transactionId = req.query.expenseId;
    let transaction = await Transaction.findOne({ _id: transactionId }).populate('payee').populate('payments.user_id');
    console.log(req.originalUrl)

    res.render('individualExpense', { path: '/groups', transaction: transaction, userId: userId });
})

router.post('/deleteExpense', async (req, res) => {
    try {
        const transactionId = new ObjectId(req.body.expenseId);
        await Transaction.deleteOne({ _id: transactionId });
        await Group.updateOne({ 'transactions': transactionId }, { $pull: { 'transactions': transactionId } });
        console.log('Transaction removed successfully');
    } catch (error) {
        console.error('Error removing transaction:', error);
    }
    res.redirect('/home')
})

router.get('/addExpense', (req, res) => {

    res.render('addExpense', { path: req.path })
})

module.exports = router