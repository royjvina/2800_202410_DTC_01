const express = require("express")
const router = express.Router()
const User = require('../models/User');
const Group = require('../models/Group');
const multer = require('multer');
const { get } = require("http");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function addFriend(friend, req) {
    loggedInUser = await User.findOneAndUpdate({ email: req.session.email }, { $push: { friends: friend._id } }, { new: true });
    await User.updateOne({ email: friend.email }, { $push: { friends: loggedInUser._id } });
}

async function getFriends(req) {
    let user = await User.findOne({ email: req.session.email }).populate('friends');
    user.friends.forEach(friend => {
        if (friend.profileImage && friend.profileImage.data) {
            friend.profileImageBase64 = `data:${friend.profileImage.contentType};base64,${friend.profileImage.data.toString('base64')}`;
        }
    });
    return user
}

router.get("/home", async (req, res) => {

    let user = await getFriends(req);
    res.render('main', { username: req.session.username, profilePic: req.session.profilePic, path: req.path, friends: user.friends });
})
router.get("/addFriend", (req, res) => {
    res.render('addFriend', { path: '/home', error: req.query.error });
});
router.get("/addGroup", async (req, res) => {
    let user = await getFriends(req);
    console.log(user);
    res.render('addGroup', { path: '/home', friends: user.friends });
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

router.post('/addGroupSubmission', upload.single('groupImage'), async (req, res) => {
    console.log(req.body);
    friends = req.body.friends.split(',');
    friends
    // newGroup = Group.create({
    //     group_name: req.body.groupName,
    //     members: [{ user_id: req.session.userId }, ...friends],
    // });
    res.redirect('/home')
});
module.exports = router