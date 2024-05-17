const express = require("express")
const { RunStepsPage } = require("openai/resources/beta/threads/runs/steps.mjs")
const router = express.Router()

router.get('/recentActivity', (req, res) => {
    res.render('recentActivity')
})

module.exports = router