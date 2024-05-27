const express = require('express');
const router = express.Router();
const insightFetcher = require('../controllers/insightFetcherController');

router.get('/insight', async (req, res) => {
  try {
    const userId = req.session.userId;
    const expenses = await insightFetcher.getExpensesByCategory(userId);
    res.render('insight', { expenses, path: '/insight' });
  } catch (error) {
    console.error('Error fetching insight:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/insight', async (req, res) => {
  try {
    const userId = req.session.userId;
    const expenses = await insightFetcher.getExpensesByCategory(userId);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching insight data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
