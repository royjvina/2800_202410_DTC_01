const express = require("express")
const router = express.Router()
const User = require('../models/User');

async function addFriend(friend, req) {
    loggedInUser = await User.findOneAndUpdate({ email: req.session.email }, { $push: { friends: friend._id } }, { new: true });
    await User.updateOne({ email: friend.email }, { $push: { friends: loggedInUser._id } });
}

    router.get("/home", (req, res) => {
        console.log(req.session.username);
        res.render('main', { username: req.session.username, profilePic: req.session.profilePic, path: req.path });
    })
    router.get("/addFriend", (req, res) => {
        res.render('addFriend', { path: '/home', error: req.query.error});
    });
    router.get("/addGroup", (req, res) => {
        res.render('addGroup', { path: '/home' });
    });
    router.post('/addFriend', async (req, res) => {
        console.log(req.body);
        let friend;
        if (req.body.friendEmail == "") {
            phoneNumber = req.body.friendPhone.replace(/[^\d]/g, '');
            console.log(phoneNumber);
            friend = await User.findOne({ phone: phoneNumber });
            if (friend) {
                addFriend(friend, req);
                res.redirect('/home');
            }
            else {
                res.redirect('/addFriend?error=UserNotFound');
            }

        }
        if (req.body.friendPhone == "") {
            console.log('email');
            friend = await User.findOne({
                email: req.body.friendEmail
            });
            if (friend) {
                addFriend(friend, req);
                res.redirect('/home');
            }
            else {
                res.redirect('/addFriend?error=UserNotFound');
            }
        }
    });
    router.post('/addGroup', async (req, res) => {
        res.redirect('/home')
    });
    module.exports = router