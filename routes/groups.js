const express = require("express")
const { RunStepsPage } = require("openai/resources/beta/threads/runs/steps.mjs")
const router = express.Router()

router.get('/groups', (req, res) => {
    res.render('groups')
})


module.exports = router