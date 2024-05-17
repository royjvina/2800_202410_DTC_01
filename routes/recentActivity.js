const express = require("express")
const router = express.Router()

router.get('/recentActivity', (req, res) => {
    res.render('recentActivity')
})

module.exports = router