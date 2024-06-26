const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const { ObjectId } = require('mongodb');
const User = require('../models/User');
const { model } = require('mongoose');
const { getFriends } = require('./friendController');

/**
 * Get the user's groups and their debt
 * @param {Request} req - The request object
 * @balpreet787
 * */
async function getGroupDebt(req) {
    let individualGroupCummalation = {};
    let user = await getFriends(req);
    for (const group of user.groups) {
        individualGroupCummalation[group._id] = 0;
        let transactions = await Transaction.find({ group_id: group._id });//finds the transactions in the group

        // Calculate the debt of the user in the group
        for (const transaction of transactions) {
            if (transaction.payee.equals(req.session.userId)) {
                let userPayment = transaction.payments.find(payment => payment.user_id.equals(req.session.userId));
                if (userPayment) {
                    individualGroupCummalation[group._id] += transaction.total_cost - userPayment.amount_paid;
                } else {
                    individualGroupCummalation[group._id] += transaction.total_cost;
                }
            }
            else {
                let userPayment = transaction.payments.find(payment => payment.user_id.equals(req.session.userId));
                if (userPayment) {
                    individualGroupCummalation[group._id] -= userPayment.amount_paid;
                }
            }
        }
    }

    return individualGroupCummalation;
}

/**
 * Get the user's friends and their debt in a group
 * @param {Group} group - The group to get the debt from
 * @balpreet787
 * */
async function getGroupDebtForFriends(group, req) {
    let userOwesTo = {};

    group.members.forEach(member => {
        userOwesTo[member.user_id._id] = { amount: 0, name: member.user_id.username, group_id: group._id };
    });
    // Calculate the debt of each friend in the group
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

    return userOwesTo;
}

/**
 * Get the user's debt in a group
 * @param {Group} group - The group to get the debt from
 * @balpreet787
 * */
async function debtInGroup(group, req) {
    let userOwesTo = {};

    group.members.forEach(member => {
        userOwesTo[member.user_id._id] = { amount: 0, name: member.user_id.username };
    });
    // Calculate the debt of each friend in the group
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

    return userOwesTo;
}


module.exports = { getGroupDebt, getGroupDebtForFriends, debtInGroup };