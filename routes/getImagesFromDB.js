const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profileImage/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.profileImage && user.profileImage.data) {
            res.set('Content-Type', user.profileImage.contentType);
            return res.send(user.profileImage.data);
        }
        res.status(404).send('Image not found');
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
});

module.exports = router;
