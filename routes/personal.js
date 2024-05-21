const express = require("express")
const router = express.Router()


router.get('/setBudget', (req, res) => {
    res.render('setBudget' , { path: '/personal' });
});
router.get('/personal', (req, res) => {
    res.render('personal' , { path: req.path });
});

module.exports = router