const express = require("express")
const router = express.Router()

router.get('/addExpenses', (req, res) => {
    res.render('addExpenses', { path: req.path })
})


module.exports = router