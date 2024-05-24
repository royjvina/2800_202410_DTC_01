const express = require("express")
const router = express.Router()
const Transaction = require('../models/Transaction');

router.get('/individualExpense', async (req, res) => {
    let userId = req.session.userId;
    let transactionId = req.query.expenseId;
    let transaction = await Transaction.findOne({ _id: transactionId }).populate('payee').populate('payments.user_id');
    console.log(req.originalUrl)
    
    res.render('individualExpense', { path: '/groups', transaction: transaction, userId: userId});
})

router.get('/addExpense', (req, res) => {
    
    res.render('addExpense', { path: req.path })
})

module.exports = router