const express = require("express")
const router = express.Router()


router.get('/addExpensePersonal', (req, res) => {
    res.render('addExpensePersonal', { path: '/personal' });
});
router.get('/setBudget', (req, res) => {
    res.render('setBudget', { path: '/personal' });
});
router.get('/personal', (req, res) => {
    res.render('personal', { path: req.path });
});

module.exports = router