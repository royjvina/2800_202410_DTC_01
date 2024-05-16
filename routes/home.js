const express = require("express")
const router = express.Router()


router.get("/home", (req, res) => {
    console.log(req.session.username);
    res.render('main', { username: req.session.username });
})
router.get("/addFriend", (req, res) => {
    res.render('addFriend');
});
router.get("/addGroup", (req, res) => {
    res.render('addGroup');
});
router.post('/addFriend', async (req, res) => {
    res.redirect('/home')
});
router.post('/addGroup', async (req, res) => {
    res.redirect('/home')
});
module.exports = router