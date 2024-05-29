const express = require("express");
const router = express.Router();
const Group = require('../models/Group');
const { getEveryFriendDebt } = require("../controllers/friendController");

/**
 * Route for rendering the groups page
 * @name get/groups
 * @function
 * @memberof module:routers/groups
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/groups', async (req, res) => {
    try {
        let groupId = req.query.groupId;
        let group = await Group.findOne({ _id: groupId }).populate('members.user_id').populate('transactions');
        let everyFriendDebt = await getEveryFriendDebt(group);
        console.log(everyFriendDebt);
        
        // Convert group picture to base64 if it exists
        if (group.group_pic && group.group_pic.data) {
            group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
        }
        
        // Render the groups page with the group data and friend debt
        res.render('groups', { path: '/home', group: group, friendDebt: everyFriendDebt });
    } catch (error) {
        console.error('Error fetching group data:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
