const express = require("express");
const router = express.Router();

/**
 * Route for rendering the add personal expense page
 * @name get/addExpensePersonal
 * @function
 * @memberof module:routers/personal
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/addExpensePersonal', (req, res) => {
    res.render('addExpensePersonal', { path: '/personal' });
});

/**
 * Route for rendering the set budget page
 * @name get/setBudget
 * @function
 * @memberof module:routers/personal
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/setBudget', (req, res) => {
    res.render('setBudget', { path: '/personal' });
});

/**
 * Route for rendering the personal page
 * @name get/personal
 * @function
 * @memberof module:routers/personal
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/personal', (req, res) => {
    res.render('personal', { path: req.path });
});

module.exports = router;
