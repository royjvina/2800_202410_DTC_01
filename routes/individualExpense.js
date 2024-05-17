const express = require("express")
const router = express.Router()

router.get('/individualExpense', (req, res) => {
    res.render('individualExpense')
})



router.get('/addExpense', (req, res) => {
    res.render('addExpense')
})

module.exports = router