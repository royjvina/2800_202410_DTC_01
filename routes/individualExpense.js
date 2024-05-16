const express = require("express")
const { RunStepsPage } = require("openai/resources/beta/threads/runs/steps.mjs")
const router = express.Router()

router.get('/individualExpense', (req, res) => {
    res.render('individualExpense')
})

router.get('/recentActivity', (req, res) => {
    res.render('recentActivity')
})

router.get('/addExpense', (req, res) => {
    res.render('addExpense')
})

module.exports = router