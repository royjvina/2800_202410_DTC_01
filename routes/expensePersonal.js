const express = require("express")
const router = express.Router()

router.get('/expensePersonal', (req, res) => {
  res.render('expensePersonal', { path: '/personal' })
})


module.exports = router