const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/settings', (req, res) => {
    const FormattedPhoneNumber = req.session.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    res.render('settings', {
        username: req.session.username,
        phoneNumber: FormattedPhoneNumber,
        profilePic: req.session.profilePic,
        email: req.session.email,
        path: req.path,
        editMode: false
    });
});

// Route to switch to edit mode
router.get('/settings/edit', (req, res) => {
    const FormattedPhoneNumber = req.session.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    res.render('settings', {
        username: req.session.username,
        phoneNumber: FormattedPhoneNumber,
        profilePic: req.session.profilePic,
        email: req.session.email,
        path: req.path,
        editMode: true
    });
});

// Route to handle user information update
router.post('/settings', async (req, res) => {
    const { username, email, phone } = req.body;
    try {
        const userId = req.session.userId;
        await User.findByIdAndUpdate(userId, { username, email, phone });
        req.session.username = username;
        req.session.email = email;
        req.session.phoneNumber = phone;
        res.redirect('/settings');
    } catch (error) {
        console.error('Error updating user information:', error);
        res.redirect('/settings');
    }
});

module.exports = router;
