const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { getExpensesByCategory } = require('../models/insightFetcher');

router.get('/insight', async (req, res) => {
  try {
    console.log('Insight route hit');

    const userId = req.session.userId;
    if (!userId) {
      throw new Error('User ID not found in session');
    }
    console.log('User ID from session:', userId);

    const expenses = await getExpensesByCategory(userId);
    console.log('Fetched expenses:', expenses);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
