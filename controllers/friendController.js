const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const { model } = require('mongoose');


/**
 * Add a friend to the user's friend list
 * @param {User} friend - The friend to be added
 * @param {Request} req - The request object
 * @balpreet787
 * */
async function addFriend(friend, req) {
    const loggedInUser = await User.findOneAndUpdate(//finds the user and updates the friends list
        { email: req.session.email },
        { $addToSet: { friends: friend._id } },
        { new: true }
    );

    await User.updateOne(//finds the friend and updates the friends list
        { email: friend.email },
        { $addToSet: { friends: loggedInUser._id } }
    );
}

/**
 * Get the user's friends
 * @param {Request} req - The request object
 * @balpreet787
 * */
async function getFriends(req) {
    let user = await User.findOne({ email: req.session.email }).populate('friends').populate('groups');//finds the user and populates the friends and groups
    user.friends.forEach(friend => {
        if (friend.profileImage && friend.profileImage.data) {
            friend.profileImageBase64 = `data:${friend.profileImage.contentType};base64,${friend.profileImage.data.toString('base64')}`;
        }
    });
    return user
}

/**
 * Get the user's friends and their debt
 * @param {Request} req - The request object
 * @balpreet787
 * */
async function getFriendDebt(req) {
    let user = await getFriends(req);
    let friendDebt = {};

    user.friends.forEach(friend => {
        friendDebt[friend._id] = 0;
    });

    let transactions = await Transaction.find({//finds the transactions where the user is the payee or the user has paid
        $or: [
            { payee: req.session.userId },
            { payments: { $elemMatch: { user_id: req.session.userId } } }
        ]
    });

    // Calculate the debt of the user with each friend
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
            let userPayment = transaction.payments.find(payment => payment.user_id.equals(req.session.userId));//finds the user payment in the transaction payments
            if (userPayment) {
                if (friendDebt[transaction.payee] !== undefined) {
                    friendDebt[transaction.payee] -= userPayment.amount_paid;
                }
            }
        }
    }
    return friendDebt;
}

/**
 * Get the user's friends and their debt in a group
 * @param {Group} group - The group to get the debt from
 * @balpreet787
 * */
async function getEveryFriendDebt(group) {
    try {
        let friendDebt = {};

        group.members.forEach(member => {
            friendDebt[member.user_id._id] = { amount: 0, name: member.user_id.username };
        });

        // Calculate the debt of each friend in the group
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
/**
 * Process the transaction for the user
 * @param {String} payeeId - The user who paid
 * @param {String} groupID - The group id
 * @param {String} payedToId - The user who received the payment
 * @param {Number} amount - The amount paid
 * @balpreet787
 * */
async function processTransaction(payeeId, groupID, payedToId, amount) {
    try {
        let reimbursement = new Transaction({//creates a new transaction
            name: "Reimbursement",
            group_id: groupID,
            category: "reimbursement",
            total_cost: amount,
            payee: payeeId,
            payments: [{ user_id: payedToId, amount_paid: amount }]
        });
        await reimbursement.save();//saves the transaction
        await Group.findByIdAndUpdate(groupID, { $push: { transactions: reimbursement._id } });//finds the group and updates the transactions
    } catch (error) {
        console.log(error);
    }
}


module.exports = { addFriend, getFriends, getFriendDebt, getEveryFriendDebt, processTransaction };