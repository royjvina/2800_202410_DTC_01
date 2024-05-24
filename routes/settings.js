const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const User = require('../models/User');
const { passwordSchema } = require('../models/UserPassword');
const bcrypt = require('bcrypt');

// Define salt rounds for password hashing
const saltRounds = 12;

router.get('/settings', async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.session.userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(req.session.userId);
        const formattedPhoneNumber = user.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        
        res.render('settings', { 
            username: user.username, 
            phoneNumber: formattedPhoneNumber, 
            profilePic: req.session.profilePic, 
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
        // Ensure user is authenticated
        if (!req.session.userId) {
            return res.status(401).send('Unauthorized');
        }

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
        // Ensure user is authenticated
        if (!req.session.userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(req.session.userId);
        user.username = req.body.username;

        if (req.file) {
            user.profileImage.data = req.file.buffer;
            user.profileImage.contentType = req.file.mimetype;
        }

        req.session.username = user.username;
        req.session.profilePic = `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`;

        await user.save();
        res.redirect('/settings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/settings/changePass', async (req, res) => { 
    res.render('changePass', { error: null, path: req.path });
});

router.post('/settings/changePass', async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        // Validate password input
        const { error } = passwordSchema.validate({ password });
        if (error) {
            return res.render('changePass', { error: error.details[0].message, path: req.path });
        }

        // Ensure user is authenticated
        if (!req.session.userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(req.session.userId);

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.render('changePass', { error: "Passwords do not match", path: req.path });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;

        await user.save();
        res.redirect('/settings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
