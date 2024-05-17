const express = require("express")
const { RunStepsPage } = require("openai/resources/beta/threads/runs/steps.mjs")
const router = express.Router()

router.get('/addExpenses', (req, res) => {
    res.render('addExpenses')
})

router.get('/home', (req, res) => {
    res.render('main')
})

module.exports = router