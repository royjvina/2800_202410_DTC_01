const express = require("express")
const router = express.Router()

router.get('/suggestedReimbursements', (req, res) => {
    res.render('suggestedReimbursements', { path: '/groups' })
})


module.exports = router