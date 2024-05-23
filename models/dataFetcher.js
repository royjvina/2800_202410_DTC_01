
const Group = require('./Group');
const Transaction = require('./Transaction');
const User = require('./User');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });


async function getUserGroups(userId) {
    const cacheKey = `userGroups_${userId}`;
    let userGroups = cache.get(cacheKey);
    if (!userGroups) {
        userGroups = await Group.find({ 'members.user_id': userId });
        cache.set(cacheKey, userGroups);
    }
    return userGroups;
}

async function getUserTransactions(userId) {
    const cacheKey = `userTransactions_${userId}`;
    let userTransactions = cache.get(cacheKey);
    if (!userTransactions) {
        userTransactions = await Transaction.find({ 'payments.user_id': userId });
        cache.set(cacheKey, userTransactions);
    }
    return userTransactions;
}

async function getUserDetails(userId) {
    const cacheKey = `userDetails_${userId}`;
    let userDetails = cache.get(cacheKey);
    if (!userDetails) {
        userDetails = await User.findById(userId);
        cache.set(cacheKey, userDetails);
    }
    return userDetails;
}

module.exports = {
    getUserGroups,
    getUserTransactions,
    getUserDetails
};
