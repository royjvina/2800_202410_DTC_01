const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../models/recentActivityFetcher');
const path = require('path');

router.get('/recentActivity', async (req, res) => {
    try {
        const recentActivities = await getRecentActivities(req.session.userId);
        res.render('recentActivity', { recentActivities: recentActivities, path: req.path });
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;