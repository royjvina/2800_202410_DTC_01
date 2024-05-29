const express = require("express");
const router = express.Router();
const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const { ObjectId } = require('mongodb');

/**
 * Route for rendering the individual expense page
 * @name get/individualExpense
 * @function
 * @memberof module:routers/expense
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/individualExpense', async (req, res) => {
    try {
        let userId = req.session.userId;
        let transactionId = req.query.expenseId;
        let transaction = await Transaction.findOne({ _id: transactionId }).populate('payee').populate('payments.user_id');
        console.log(req.originalUrl);

        res.render('individualExpense', { path: '/groups', transaction: transaction, userId: userId });
    } catch (error) {
        console.error('Error fetching individual expense:', error);
        res.status(500).send('Internal server error');
    }
});

/**
 * Route to delete an expense
 * @name post/deleteExpense
 * @function
 * @memberof module:routers/expense
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/deleteExpense', async (req, res) => {
    try {
        const transactionId = new ObjectId(req.body.expenseId);
        await Transaction.deleteOne({ _id: transactionId }); // Deletes the transaction
        await Group.updateOne({ 'transactions': transactionId }, { $pull: { 'transactions': transactionId } }); // Removes the transaction from the group
        console.log('Transaction removed successfully');
    } catch (error) {
        console.error('Error removing transaction:', error);
    }
    res.redirect('/home');
});

/**
 * Route for rendering the add expense page
 * @name get/addExpense
 * @function
 * @memberof module:routers/expense
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/addExpense', (req, res) => {
    res.render('addExpense', { path: req.path });
});

module.exports = router;
