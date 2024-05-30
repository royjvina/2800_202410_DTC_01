const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const User = require('../models/User');
const { passwordSchema } = require('../models/UserPassword');
const bcrypt = require('bcrypt');

// Define salt rounds for password hashing
const saltRounds = 12;

/**
 * Route for rendering the settings page
 * @name get/settings
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/settings', async (req, res) => {
    try {
      
        const user = await User.findById(req.session.userId);
        const formattedPhoneNumber = user.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        let phoneExists = false;
        if (req.query.phoneExists) {
            phoneExists = true;
        }

        res.render('settings', {
            username: user.username,
            phoneNumber: formattedPhoneNumber,
            profilePic: req.session.profilePic,
            email: user.email,
            editMode: false,
            path: req.path,
            phoneExists: phoneExists
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Route for rendering the edit settings page
 * @name get/settings/edit
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route for updating user settings
 * @name post/settings
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/settings', upload.single('profileImage'), async (req, res) => {
    try {
       
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

/**
 * Route for rendering the change password page
 * @name get/settings/changePass
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/settings/changePass', async (req, res) => {
    res.render('changePass', { error: null, path: req.path });
});

/**
 * Route for changing user password
 * @name post/settings/changePass
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route for rendering the change phone number page
 * @name get/settings/changeNum
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/settings/changeNum', async (req, res) => {
    res.render('changeNum', { error: null, path: req.path });
});

/**
 * Route for changing user phone number
 * @name post/settings/changeNum
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/settings/changeNum', async (req, res) => {
    try {
        let { phone } = req.body;
        phone = phone.replace(/[^\d]/g, '');
        const phoneInDB = await User.findOne({ phone: phone });
        let phoneExists = phoneInDB ? true : false;
        if (phoneExists) {
            res.redirect('/settings?phoneExists=true');
        }
        else {
            const user = await User.findById(req.session.userId);
            user.phone = phone;
            await user.save();

            req.session.phone = phone;

            res.redirect('/settings');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Route for rendering the delete account page
 * @name get/settings/deleteAccount
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/settings/deleteAccount', async (req, res) => {
    res.render('deleteAccount', { path: req.path });
});

/**
 * Route for deleting user account
 * @name post/settings/deleteAccount
 * @function
 * @memberof module:routers/settings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/settings/deleteAccount', async (req, res) => {
    try {
        // Update user information instead of deleting
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), saltRounds);
        await User.findByIdAndUpdate(req.session.userId, {
            email: `deleted@user.com`,
            username: `Deleted User (${user.username})`,
            profileImage: null,
            phone: "0000000000",
            password: randomPassword
        });

        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
