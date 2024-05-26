const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { model } = require('mongoose');

async function addFriend(friend, req) {
    const loggedInUser = await User.findOneAndUpdate(
        { email: req.session.email },
        { $addToSet: { friends: friend._id } },
        { new: true }
    );

    await User.updateOne(
        { email: friend.email },
        { $addToSet: { friends: loggedInUser._id } }
    );
}


async function getFriends(req) {
    let user = await User.findOne({ email: req.session.email }).populate('friends').populate('groups');
    user.friends.forEach(friend => {
        if (friend.profileImage && friend.profileImage.data) {
            friend.profileImageBase64 = `data:${friend.profileImage.contentType};base64,${friend.profileImage.data.toString('base64')}`;
        }
    });
    return user
}

async function getFriendDebt(req) {
    let user = await getFriends(req);
    let friendDebt = {};

    user.friends.forEach(friend => {
        friendDebt[friend._id] = 0;
    });

    let transactions = await Transaction.find({
        $or: [
            { payee: req.session.userId },
            { payments: { $elemMatch: { user_id: req.session.userId } } }
        ]
    });

    for (const transaction of transactions) {
        if (transaction.payee.equals(req.session.userId)) {
            transaction.payments.forEach(payment => {
                if (payment.user_id != req.session.userId) {
                    if (friendDebt[payment.user_id] !== undefined) {
                        friendDebt[payment.user_id] += payment.amount_paid;
                    }
                }
            });
        } else {
            let userPayment = transaction.payments.find(payment => payment.user_id.equals(req.session.userId));
            if (userPayment) {
                if (friendDebt[transaction.payee] !== undefined) {
                    friendDebt[transaction.payee] -= userPayment.amount_paid;
                }
            }
        }
    }
    return friendDebt;
}

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

module.exports = { addFriend, getFriends, getFriendDebt, getEveryFriendDebt};