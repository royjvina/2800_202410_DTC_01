const express = require("express")
const router = express.Router()

router.get('/groups', (req, res) => {
    res.render('groups', { path: '/home', groupName: 'Groups', usersInGroup: ['User 1', 'User 2', 'User 3', 'User 4'], })
})


module.exports = router