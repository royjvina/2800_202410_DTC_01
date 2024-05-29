const express = require("express");
const router = express.Router();

/**
 * Route for rendering the personal expense page
 * @name get/expensePersonal
 * @function
 * @memberof module:routers/expense
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/expensePersonal', (req, res) => {
  res.render('expensePersonal', { path: '/personal' });
});

module.exports = router;
