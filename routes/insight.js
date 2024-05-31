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
    const expenses = await insightFetcher.getExpensesByCategory(userId);// Fetches the expenses by category
    res.render('insight', { expenses, path: '/insight' });
  } catch (error) {
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
    const expenses = await insightFetcher.getExpensesByCategory(userId, startDate, endDate);// Fetches the expenses by category
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
