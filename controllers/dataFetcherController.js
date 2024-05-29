const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

/** 
 * Function to get the groups of a user, utilizing cache for efficiency
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - A promise that resolves to an array of groups the user belongs to
 * @async
 * @example
 * // Get user groups
 * getUserGroups('12345').then(groups => console.log(groups));
 */
async function getUserGroups(userId) {
    const cacheKey = `userGroups_${userId}`;
    let userGroups = cache.get(cacheKey);
    if (!userGroups) {
        userGroups = await Group.find({ 'members.user_id': userId });
        cache.set(cacheKey, userGroups);
    }
    return userGroups;
}

/** 
 * Function to get the transactions of a user, utilizing cache for efficiency
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - A promise that resolves to an array of transactions associated with the user
 * @async
 * @example
 * // Get user transactions
 * getUserTransactions('12345').then(transactions => console.log(transactions));
 */
async function getUserTransactions(userId) {
    const cacheKey = `userTransactions_${userId}`;
    let userTransactions = cache.get(cacheKey);
    if (!userTransactions) {
        userTransactions = await Transaction.find({ 'payments.user_id': userId });
        cache.set(cacheKey, userTransactions);
    }
    return userTransactions;
}

/** 
 * Function to get the details of a user, utilizing cache for efficiency
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} - A promise that resolves to the details of the user
 * @async
 * @example
 * // Get user details
 * getUserDetails('12345').then(details => console.log(details));
 */
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
