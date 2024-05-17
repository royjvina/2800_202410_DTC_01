const express = require("express")
const { RunStepsPage } = require("openai/resources/beta/threads/runs/steps.mjs")
const router = express.Router()

router.get('/addExpenses', (req, res) => {
    res.render('addExpenses')
})


module.exports = router