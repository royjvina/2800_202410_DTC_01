const express = require("express")
const router = express.Router()
const Group = require('../models/Group');



router.get('/groups', async (req, res) => {
    let groupId = req.query.groupId;
    let group = await Group.findOne({ _id: groupId }).populate('members.user_id');
    if (group.group_pic && group.group_pic.data) {
    group.group_picBase64 = `data:${group.group_pic.contentType};base64,${group.group_pic.data.toString('base64')}`;
    }

    res.render('groups', { path: '/home', group: group });
})


module.exports = router