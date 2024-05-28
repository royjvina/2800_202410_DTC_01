const express = require("express")
const router = express.Router()
const User = require('../models/User');
const Group = require('../models/Group');
const multer = require('multer');
const { get } = require("http");
const { ObjectId } = require('mongodb');
const Transaction = require('../models/Transaction');
const { addFriend, getFriends, getFriendDebt } = require('../controllers/friendController');
const { getGroupDebt, getGroupDebtForFriends } = require('../controllers/groupController');
const { mapAndSortEntitiesWithDebts } = require('../controllers/sortingController');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/home", async (req, res) => {

    try {
        let user = await getFriends(req);
        let groupDebt = await getGroupDebt(req);
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
        let friendDebt = await getFriendDebt(req);
        let TotalpositiveDebt = 0;
        let TotalnegativeDebt = 0;
        for (friend in friendDebt) {
            if (friendDebt[friend] > 0) {
                TotalpositiveDebt += friendDebt[friend];
            }
            else {
                TotalnegativeDebt += friendDebt[friend];
            }
        }
        let debtInfo = { TotalpositiveDebt: TotalpositiveDebt, TotalnegativeDebt: Math.abs(TotalnegativeDebt) };
        const friendsWithDebts = mapAndSortEntitiesWithDebts(user.friends, friendDebt);
        const groupsWithDebts = mapAndSortEntitiesWithDebts(groups, groupDebt);

        res.render('main', { username: req.session.username, profilePic: req.session.profilePic, path: req.path, friends: friendsWithDebts, groups: groupsWithDebts, debtInfo: debtInfo });
    }
    catch (error) {
        console.log(error);
        res.render('/main');
    }
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
    res.render('addGroup', { path: '/home', friends: user.friends, group: group });
});

router.post('/addFriend', async (req, res) => {
    let friend;
    let phoneNumber = req.body.friendPhone.replace(/[^\d]/g, '');
    if (phoneNumber.length < 10) {
        phoneNumber = "";
    }
    console.log(phoneNumber);
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
    else if (phoneNumber == "") {
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
    else {
        res.redirect('/addFriend?error=UserNotFound');
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
                await User.updateMany({ _id: { $in: group.members.map(member => member.user_id) } }, { $addToSet: { groups: group._id } });
            }
            else {
                const group = await Group.findByIdAndUpdate(req.body.groupId, {
                    group_name: req.body.groupName,
                    $addToSet: { members: { $each: friendsinGroupID } }
                }, { new: true });
                await User.updateMany({ _id: { $in: group.members.map(member => member.user_id) } }, { $addToSet: { groups: group._id } });

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

router.post('/deleteFriend', async (req, res) => {
    try {
        console.log(req.body);
        const friendPhone = req.body.friendDeletePhone;
        let friend = await User.findOneAndUpdate({ phone: friendPhone }, { $pull: { friends: req.session.userId } });

        if (friend) {
            await User.findByIdAndUpdate(req.session.userId, { $pull: { friends: friend._id } });
        } else {
            console.log('Friend not found');
        }

        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.redirect('/home');
    }
});


router.post('/settleUp', async (req, res) => {
    try {
        console.log(req.body);
        let friend = await User.findOne({ phone: req.body.friendPhone });
        let amount = parseFloat(req.body.enterAmount);
        let maxValue = (amount == parseFloat(req.body.maxAmount));
        let friendsDebts = [];
        let totalPositiveDebt = 0;
        let totalNegativeDebt = 0;

        let commonGroups = await Group.find({ 'members.user_id': { $all: [req.session.userId, friend._id] } }).populate('transactions').populate({ path: 'members.user_id', select: 'username' });

        // Calculate debts in common groups
        for (let group of commonGroups) {
            let friendsDebt = await getGroupDebtForFriends(group, req);
            friendsDebts.push(friendsDebt);
            let debt = friendsDebt[friend._id.toString()].amount;
            if (debt > 0) {
                totalPositiveDebt += debt;
            } else {
                totalNegativeDebt += debt;
            }
        }

        // Adjust amount if maxValue is true
        if (maxValue) {
            amount = Math.abs(totalNegativeDebt);
            for (let i = 0; i < commonGroups.length; i++) {
                if (totalPositiveDebt > 0) {
                    let group = commonGroups[i];
                    let friendsDebt = friendsDebts[i];
                    let debt = friendsDebt[friend._id.toString()].amount;

                    if (debt > 0) {
                        let amountToBePaid = Math.min(totalPositiveDebt, debt);
                        let reimbursement = new Transaction({
                            name: "Reimbursement",
                            group_id: group._id,
                            category: "miscellaneous",
                            total_cost: amountToBePaid,
                            payee: friend._id,
                            payments: [{ user_id: req.session.userId, amount_paid: amountToBePaid }]
                        });
                        await reimbursement.save();
                        await Group.findByIdAndUpdate(group._id, { $push: { transactions: reimbursement._id } });
                        totalPositiveDebt -= amountToBePaid;
                        totalPositiveDebt -= amountToBePaid;
                    }
                }
            }
        }


        for (let i = 0; i < commonGroups.length; i++) {
            let group = commonGroups[i];
            let friendsDebt = await getGroupDebtForFriends(group, req);;
            let debt = friendsDebt[friend._id.toString()].amount;
            let amountToBePaid = Math.min(amount, Math.abs(debt));
            let reimbursement;
            if (amountToBePaid > 0) {
                reimbursement = new Transaction({
                    name: "Reimbursement",
                    group_id: group._id,
                    category: "miscellaneous",
                    total_cost: amountToBePaid,
                    payee: req.session.userId,
                    payments: [{ user_id: friend._id, amount_paid: amountToBePaid }]
                });
                await reimbursement.save();
                await Group.findByIdAndUpdate(group._id, { $push: { transactions: reimbursement._id } });
                amount -= amountToBePaid;
            }
        }

        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error settling up");
    }
});


module.exports = router