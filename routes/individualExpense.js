const express = require("express")
const router = express.Router()

router.get('/individualExpense', (req, res) => {
    res.render('individualExpense', { path: '/home' })
})



router.get('/addExpense', (req, res) => {
    res.render('addExpense', { path: req.path })
})

module.exports = router