const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');
const multer = require('multer');
const { get } = require("http");
const { ObjectId } = require('mongodb');
const Transaction = require('../models/Transaction');
const { addFriend, getFriends, getFriendDebt, processTransaction, getEveryFriendDebt } = require('../controllers/friendController');
const { getGroupDebt, getGroupDebtForFriends } = require('../controllers/groupController');
const { mapAndSortEntitiesWithDebts } = require('../controllers/sortingController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Route for rendering the home page
 * @name get/home
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/home", async (req, res) => {
    try {
        let user = await getFriends(req); // Get friends of the user
        let groupDebt = await getGroupDebt(req); // Get group debts of the user
        let groups = await Group.find({ 'members.user_id': req.session.userId }).populate('members.user_id'); // Get groups of the user and populate the members

        // Get the group pic and profile pic of the user and friends
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
        let friendDebt = await getFriendDebt(req); // Get friend debts of the user
        let totalPositiveDebt = 0;
        let totalNegativeDebt = 0;

        for (let group in groupDebt) {
            if (groupDebt[group] > 0) {
                totalPositiveDebt += groupDebt[group];
            } else {
                totalNegativeDebt += groupDebt[group];
            }
        }

        let debtInfo = { totalPositiveDebt: Math.abs(totalPositiveDebt), totalNegativeDebt: Math.abs(totalNegativeDebt) }; // Get the total positive and negative debts of the user
        console.log(debtInfo);
        const friendsWithDebts = mapAndSortEntitiesWithDebts(user.friends, friendDebt); // Sort the friends based on debts
        const groupsWithDebts = mapAndSortEntitiesWithDebts(groups, groupDebt); // Sort the groups based on debts

        res.render('main', { username: req.session.username, profilePic: req.session.profilePic, path: req.path, friends: friendsWithDebts, groups: groupsWithDebts, debtInfo: debtInfo });
    } catch (error) {
        console.log(error);
        res.render('main');
    }
});

/**
 * Route for rendering the add friend page
 * @name get/addFriend
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/addFriend", (req, res) => {
    res.render('addFriend', { path: '/home', error: req.query.error });
});

/**
 * Route for rendering the add group page
 * @name get/addGroup
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/addGroup", async (req, res) => {
    let user = await getFriends(req); // Get friends of the user
    let groupId = req.query.groupId;
    let group = await Group.findOne({ _id: groupId }).populate('members.user_id').populate('transactions'); // Get the group based on the group id and populate the members and transactions
    let everyFriendDebt = await getEveryFriendDebt(group); // Get the debts of the friends in the group
    (user.friends).push(user); // Get all the members of the group (friends and user
    // Get the group pic of the group if coming to the edit group page
    if (group) {
        if (group.group_pic && group.group_pic.data) {
            group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
        }
    }

    res.render('addGroup', { path: '/home', friends: user.friends, group: group, groupBalance: everyFriendDebt });
});

/**
 * Post route for adding a friend, adds the friend to the user's friend list and updates the friend's friend list
 * @name post/addFriend
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/addFriend', async (req, res) => {
    let friend;
    let phoneNumber = req.body.friendPhone.replace(/[^\d]/g, '');
    if (phoneNumber.length < 10) {
        phoneNumber = "";
    }
    if (req.body.friendEmail == "") {
        // Find friend by phone number
        friend = await User.findOne({ phone: phoneNumber });
        if (friend) {
            addFriend(friend, req); // Add friend to the user's friend list and update the friend's friend list
            res.redirect('/home');
        } else {
            res.redirect('/addFriend?error=UserNotFound');
        }
    } else if (phoneNumber == "") {
        friend = await User.findOne({ email: req.body.friendEmail }); // Find friend by email
        if (friend) {
            addFriend(friend, req); // Add friend to the user's friend list and update the friend's friend list
            res.redirect('/home');
        } else {
            res.redirect('/addFriend?error=UserNotFound');
        }
    } else {
        res.redirect('/addFriend?error=UserNotFound');
    }
});

/**
 * Post route for adding a group, adds the group to the user's group list and updates the group's member list
 * @name post/addGroupSubmission
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/addGroupSubmission', upload.single('groupImage'), async (req, res) => {
    try {
        let friends = (req.body.friends.split(',')).filter(friend => friend != '');
        let uniqueFriends = new Set(friends);
        let friendsinGroupID = [];
        for (let id of uniqueFriends) {
            let friend = await User.findOne({ _id: id }); // Find friend by ID
            if (friend) {
                friendsinGroupID.push({ user_id: friend._id }); // Add friend to the group's member list
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
            const newGroup = await Group.create({ // Create a new group
                group_name: req.body.groupName,
                group_pic: groupImage,
                members: [{ user_id: req.session.userId }, ...friendsinGroupID],
            });

            await User.updateMany({ _id: { $in: newGroup.members.map(member => member.user_id) } }, { $push: { groups: newGroup._id } }); // Update members' user schema with the new group ID
        } else {
            if (groupImage) {
                const group = await Group.findByIdAndUpdate(req.body.groupId, { // Update the group with the new group name, members, and group pic if the group already exists
                    group_name: req.body.groupName,
                    group_pic: groupImage,
                    $addToSet: { members: { $each: friendsinGroupID } }
                }, { new: true });
                await User.updateMany({ _id: { $in: group.members.map(member => member.user_id) } }, { $addToSet: { groups: group._id } }); // Update new members' user schema with the group ID
            } else {
                const group = await Group.findByIdAndUpdate(req.body.groupId, { // Update the group with the new group name and members if the group already exists
                    group_name: req.body.groupName,
                    $addToSet: { members: { $each: friendsinGroupID } }
                }, { new: true });
                await User.updateMany({ _id: { $in: group.members.map(member => member.user_id) } }, { $addToSet: { groups: group._id } }); // Update new members' user schema with the group ID
            }
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error);
    }
});

/**
 * Post route for deleting a group, and deletes the group from the user's group list and deletes the group's transactions
 * @name post/deleteGroup
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/deleteGroup', async (req, res) => {
    try {
        let groupID = new ObjectId(req.body.groupDeleteId);
        await Group.findByIdAndDelete(groupID); // Delete the group
        await User.updateMany({ groups: groupID }, { $pull: { groups: groupID } }); // Update all the user schemas that contained the group ID by removing the group ID
        await Transaction.deleteMany({ group_id: groupID }); // Delete all the transactions in the group
    } catch (error) {
        console.log(error);
    }
    res.redirect('/home');
});

/**
 * Post route for deleting a friend, and deletes the friend from the user's friend list and updates the friend's friend list
 * @name post/deleteFriend
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/deleteFriend', async (req, res) => {
    try {
        const friendId = req.body.friendDeleteId;
        let friend = await User.findOneAndUpdate({ _id: friendId }, { $pull: { friends: req.session.userId } }); // Update the friend's friend list by removing the user

        if (friend) {
            await User.findByIdAndUpdate(req.session.userId, { $pull: { friends: friend._id } }); // Update the user's friend list by removing the friend
        } else {
            console.log('Friend not found');
        }

        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.redirect('/home');
    }
});

/**
 * Post route for settling up with a friend, settles up with the friend in all common groups
 * @name post/settleUp
 * @function
 * @memberof module:routers/home
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/settleUp', async (req, res) => {
    try {
        let friend = await User.findOne({ _id: req.body.friendId });
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
            debt > 0 ? totalPositiveDebt += debt : totalNegativeDebt += debt;
        }

        // Adjust amount if maxValue is true
        if (maxValue) {
            amount = Math.abs(totalNegativeDebt);
            // Settle up where friends owe the user
            for (let i = 0; i < commonGroups.length; i++) {
                if (totalPositiveDebt > 0) {
                    let group = commonGroups[i];
                    let friendsDebt = friendsDebts[i];
                    let debt = friendsDebt[friend._id.toString()].amount;

                    if (debt > 0) {
                        let amountToBePaid = Math.min(totalPositiveDebt, debt);
                        await processTransaction(friend._id, group._id, req.session.userId, amountToBePaid);
                        totalPositiveDebt -= amountToBePaid;
                    }
                }
            }
        }

        // Settle up with friends who are owed by the user
        for (let i = 0; i < commonGroups.length; i++) {
            let group = commonGroups[i];
            let friendsDebt = await getGroupDebtForFriends(group, req); // Get the debts of the friends in the group
            let debt = friendsDebt[friend._id.toString()].amount;
            let amountToBePaid = Math.min(amount, Math.abs(debt));
            if (amountToBePaid > 0) {
                await processTransaction(req.session.userId, group._id, friend._id, amountToBePaid);
                amount -= amountToBePaid;
            }
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error settling up");
    }
});

module.exports = router;
