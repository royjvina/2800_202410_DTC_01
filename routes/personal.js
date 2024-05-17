const express = require("express")
const router = express.Router()

router.get('/personal', (req, res) => {
    res.render('personal')
})

module.exports = router