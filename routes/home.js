const express = require("express")
const router = express.Router()
const User = require('../models/User');
const Group = require('../models/Group');
const multer = require('multer');
const { get } = require("http");
const { ObjectId } = require('mongodb');

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
    let groups = await Group.find({ 'members.user_id': req.session.userId }).populate('members.user_id');
    groups.forEach(group => {
        if (group.group_pic && group.group_pic.data) {
            group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
        }
        group.members.forEach(member => {

            if (member.user_id.profileImage && member.user_id.profileImage.data) {
                member.user_id.profileImageBase64 = `data:${member.user_id.profileImage.contentType};base64,${member.user_id.profileImage.data.toString('base64')}`;
            }
        });
    });
    res.render('main', { username: req.session.username, profilePic: req.session.profilePic, path: req.path, friends: user.friends, groups: groups });
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
    try {
        let friends = (req.body.friends.split(',')).filter(friend => friend != '');
        console.log(friends);
        let uniqueFriends = new Set(friends);
        let friendsinGroupID = [];
        for (let phoneNumber of uniqueFriends) {
            let friend = await User.findOne({ phone: phoneNumber });
            if (friend) {
                friendsinGroupID.push({ user_id: friend._id });
            }
        }
        console.log(friendsinGroupID);
        let groupImage = null;
        if (req.file) {
            groupImage = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        newGroup = await Group.create({
            group_name: req.body.groupName,
            group_pic: groupImage,
            members: [{ user_id: req.session.userId }, ...friendsinGroupID],
        });

        await User.updateMany({ _id: { $in: newGroup.members.map(member => member.user_id) } }, { $push: { groups: newGroup._id } });
        console.log(newGroup);
        res.redirect('/home')
    } catch (error) {
        console.log(error);
    }
});

router.post('/deleteGroup', async (req, res) => {
    try {
        console.log(req.body);
        let groupID = new ObjectId(req.body.groupDeleteId);
        console.log(groupID);
        await Group.findByIdAndDelete(groupID);
        await User.updateMany({ groups: groupID }, { $pull: { groups: groupID } });
    }
    catch (error) {
        console.log(error);
    }
    res.redirect('/home');
});
module.exports = router