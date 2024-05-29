const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Group = require('../models/Group');

/**
 * Function to get expenses grouped by category for a user within a specified date range
 * @param {string} userId - The ID of the user
 * @param {string} [startDate] - The start date of the range (optional)
 * @param {string} [endDate] - The end date of the range (optional)
 * @returns {Promise<Array>} - A promise that resolves to an array of expense objects grouped by category
 * @async
 * @throws {Error} - Throws an error if the user is not found or any other issue occurs during fetching
 * @example
 * // Get expenses by category for user '12345' from '2023-01-01' to '2023-01-31'
 * getExpensesByCategory('12345', '2023-01-01', '2023-01-31').then(expenses => console.log(expenses));
 */
async function getExpensesByCategory(userId, startDate, endDate) {
  try {
    // Find the user by ID and populate the 'groups' field
    const user = await User.findById(userId).populate('groups');
    if (!user) {
      throw new Error('User not found');
    }

    // Extract group IDs from the user's groups
    const groupIds = user.groups.map(group => group._id);
    console.log(`Found group IDs: ${groupIds}`);

    // Build the match query for transactions
    const matchQuery = { group_id: { $in: groupIds } };

    // Add date range to the match query if provided
    if (startDate && endDate) {
      matchQuery.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Aggregate transactions to group by category and sum the total cost
    const expenses = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$category", total_cost: { $sum: "$total_cost" } } }
    ]);

    // Process the aggregated expenses to map categories to total costs
    const expenseMap = expenses.reduce((acc, expense) => {
      const category = expense._id.toLowerCase();
      if (acc[category]) {
        acc[category] += expense.total_cost;
      } else {
        acc[category] = expense.total_cost;
      }
      return acc;
    }, {});

    // Convert the expense map to an array of expense objects
    const result = Object.keys(expenseMap).map(key => ({
      category: key,
      totalCost: expenseMap[key]
    }));

    console.log(`Processed expenses: ${JSON.stringify(result)}`);

    return result;
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    throw new Error('Error fetching expenses by category: ' + error.message);
  }
}

module.exports = {
  getExpensesByCategory
};
