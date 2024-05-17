const express = require("express")
const router = express.Router()


router.get('/setBudget', (req, res) => {
    res.render('setBudget');
});
router.get('/personal', (req, res) => {
    res.render('personal');
});

module.exports = router