const express = require("express")
const router = express.Router()

router.get('/groups', (req, res) => {
    res.render('groups')
})


module.exports = router