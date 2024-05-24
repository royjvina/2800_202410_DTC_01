const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../models/recentActivityFetcher');
const path = require('path');

router.get('/recentActivity', async (req, res) => {
    try {
        const recentActivities = await getRecentActivities(req.session.userId);
        let groupImg;
        console.log(recentActivities.groupPic)
        if (recentActivities.groupPic && recentActivities.groupPic.data) {
            console.log("dffs")
            console.log(groupImg)
            groupImg = `data:${recentActivities.groupPic.contentType};base64,${recentActivities.groupPic.data.toString('base64')}`;
            }
        res.render('recentActivity', { recentActivities: recentActivities, path: req.path, groupPic: groupImg });
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;