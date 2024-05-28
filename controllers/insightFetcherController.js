const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Group = require('../models/Group');

async function getExpensesByCategory(userId, startDate, endDate) {
  try {
    const user = await User.findById(userId).populate('groups');
    if (!user) {
      throw new Error('User not found');
    }

    const groupIds = user.groups.map(group => group._id);
    console.log(`Found group IDs: ${groupIds}`);

    const matchQuery = { group_id: { $in: groupIds } };

    if (startDate && endDate) {
      matchQuery.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }


    const expenses = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$category", total_cost: { $sum: "$total_cost" } } }
    ]);

    const expenseMap = expenses.reduce((acc, expense) => {
      const category = expense._id.toLowerCase();
      if (acc[category]) {
        acc[category] += expense.total_cost;
      } else {
        acc[category] = expense.total_cost;
      }
      return acc;
    }, {});

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