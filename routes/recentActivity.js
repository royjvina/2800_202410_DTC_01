const express = require("express")
const { RunStepsPage } = require("openai/resources/beta/threads/runs/steps.mjs")
const router = express.Router()

router.get('/recentActivity', (req, res) => {
    res.render('recentActivity')
})

router.get('/individualExpense', (req, res) => {
    res.render('individualExpense')
})

module.exports = router