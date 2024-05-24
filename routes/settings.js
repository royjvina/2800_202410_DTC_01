const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const User = require('../models/User');

router.get('/settings', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const formattedPhoneNumber = user.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        
        res.render('settings', { 
            username: user.username, 
            phoneNumber: formattedPhoneNumber, 
            profilePic: `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`, 
            email: user.email, 
            editMode: false,
            path: req.path 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/settings/edit', async (req, res) => {
    try {
        const formattedPhoneNumber = req.session.phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        res.render('settings', { 
            username: req.session.username, 
            phoneNumber: formattedPhoneNumber, 
            profilePic: req.session.profilePic, 
            email: req.session.email, 
            editMode: true,
            path: req.path 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/settings', upload.single('profileImage'), async (req, res) => {
    try {
        // Find the user by their ID
        const user = await User.findById(req.session.userId);

        // Update the username
        user.username = req.body.username;

        // Check if a new profile image was uploaded
        if (req.file) {
            // Update the profile image
            user.profileImage.data = req.file.buffer;
            user.profileImage.contentType = req.file.mimetype;
        }

        req.session.username = user.username;
        req.session.profilePic = `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`

        // Save the updated user
        await user.save();

        // Redirect to the settings page
        res.redirect('/settings');
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
