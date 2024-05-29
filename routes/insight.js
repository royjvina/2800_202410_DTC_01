const express = require('express');
const router = express.Router();
const insightFetcher = require('../controllers/insightFetcherController');

/**
 * Route for rendering the insight page with user expenses
 * @name get/insight
 * @function
 * @memberof module:routers/insight
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * API route for fetching user expenses by category
 * @name get/api/insight
 * @function
 * @memberof module:routers/insight
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/api/insight', async (req, res) => {
  try {
    const userId = req.session.userId;
    const { startDate, endDate } = req.query;
    const expenses = await insightFetcher.getExpensesByCategory(userId, startDate, endDate);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching insight data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
