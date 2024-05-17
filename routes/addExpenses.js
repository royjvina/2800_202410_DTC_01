const express = require("express")
const router = express.Router()

router.get('/addExpenses', (req, res) => {
    res.render('addExpenses')
})


module.exports = router