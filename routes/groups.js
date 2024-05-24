const express = require("express")
const router = express.Router()
const Group = require('../models/Group');
const { get } = require("http");



async function getEveryFriendDebt(group) {
    try {
        let friendDebt = {};

        group.members.forEach(member => {
            friendDebt[member.user_id._id] = { amount: 0, name: member.user_id.username };
        });

        for (const transaction of group.transactions) {
            for (const member of group.members) {
                if (transaction.payee.equals(member.user_id._id)) {
                    let userPayment = transaction.payments.find(payment => payment.user_id.equals(member.user_id._id));
                    if (userPayment) {
                        friendDebt[member.user_id._id].amount += transaction.total_cost - userPayment.amount_paid;
                    } else {
                        friendDebt[member.user_id._id].amount += transaction.total_cost;
                    }
                } else {
                    let userPayment = transaction.payments.find(payment => payment.user_id.equals(member.user_id._id));
                    if (userPayment) {
                        friendDebt[member.user_id._id].amount -= userPayment.amount_paid;
                    }
                }
            }
        }

        return friendDebt;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to calculate friend debt');
    }


}

router.get('/groups', async (req, res) => {
    let groupId = req.query.groupId;
    let group = await Group.findOne({ _id: groupId }).populate('members.user_id').populate('transactions');
    let everyFriendDebt = await getEveryFriendDebt(group);
    console.log(everyFriendDebt);
    if (group.group_pic && group.group_pic.data) {
    group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
    }
    

    res.render('groups', { path: '/home', group: group, friendDebt: everyFriendDebt});
})


module.exports = router