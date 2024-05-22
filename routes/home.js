const express = require("express")
const router = express.Router()
const User = require('../models/User');
const Group = require('../models/Group');
const multer = require('multer');
const { get } = require("http");
const { ObjectId, Transaction } = require('mongodb');

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

router.get('/easterEgg', async (req, res) => {

    res.render('easterEggPopUp', {path: req.path});
});

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
});

router.get("/addFriend", (req, res) => {
    res.render('addFriend', { path: '/home', error: req.query.error });
});

router.get("/addGroup", async (req, res) => {
    let user = await getFriends(req);
    let groupId = req.query.groupId;
    let group = await Group.findOne({ _id: groupId }).populate('members.user_id');
    if (group) {
        if (group.group_pic && group.group_pic.data) {
        group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
        }
    }

    // res.render('addGroup', { path: `/groups?groupId=${groupId}`, group: group, friends: user.friends })
    res.render('addGroup', { path: '/home', friends: user.friends , group: group});
});

router.post('/addFriend', async (req, res) => {
    let friend;
    let phoneNumber = req.body.friendPhone.replace(/[^\d]/g, '');
    if (req.body.friendEmail == "") {
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
        let uniqueFriends = new Set(friends);
        let friendsinGroupID = [];
        for (let phoneNumber of uniqueFriends) {
            let friend = await User.findOne({ phone: phoneNumber });
            if (friend) {
                friendsinGroupID.push({ user_id: friend._id });
            }
        }
        let groupImage = null;
        if (req.file) {
            groupImage = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        if (!req.body.groupId) {
            const newGroup = await Group.create({
            group_name: req.body.groupName,
            group_pic: groupImage,
            members: [{ user_id: req.session.userId }, ...friendsinGroupID],
        });

        await User.updateMany({ _id: { $in: newGroup.members.map(member => member.user_id) } }, { $push: { groups: newGroup._id } });
    }
    else {
        if (groupImage) {
        const group = await Group.findByIdAndUpdate(req.body.groupId, {
            group_name: req.body.groupName,
            group_pic: groupImage,
            $addToSet: { members: { $each: friendsinGroupID } }
        }, { new: true });
        await User.updateMany({ _id: { $in: group.members.map(member => member.user_id) } }, { $push: { groups: group._id } });
    }
    else {
        const group = await Group.findByIdAndUpdate(req.body.groupId, {
            group_name: req.body.groupName,
            $addToSet: { members: { $each: friendsinGroupID } }
        }, { new: true });
        await User.updateMany({ _id: { $in: group.members.map(member => member.user_id) } }, { $push: { groups: group._id } });
        
    }
}
        res.redirect('/home')
    } catch (error) {
        console.log(error);
    }
});

router.post('/deleteGroup', async (req, res) => {
    try {
        let groupID = new ObjectId(req.body.groupDeleteId);
        await Group.findByIdAndDelete(groupID);
        await User.updateMany({ groups: groupID }, { $pull: { groups: groupID } });
        await Transaction.deleteMany({ group_id: groupID });
    }
    catch (error) {
        console.log(error);
    }
    res.redirect('/home');
});

router.post('/settleUp', async (req, res) => {
    try {
        let userPayeeTransactions = await Transaction.find({ payee: req.session.userId });
        let friend = await User.findOne({ phone: req.body.friendPhone });
        let friendID = friend._id;
        let userPayerTransactions = await Transaction.find({ payments: { $elemMatch: { user_id: friendID } } });
        let userPayerTotal = 0;
        userPayerTransactions.forEach(transaction => {
            transaction.payments.forEach(payment => {
                if (payment.user_id == friendID) {
                    userPayerTotal += payment.amount_paid;
                }
            });
        });
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router