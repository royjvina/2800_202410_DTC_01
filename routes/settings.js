const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const User = require('../models/User');
const { passwordSchema } = require('../models/UserPassword');
const { getGroupDebt } = require('../controllers/groupController');
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
        let groupDebt = await getGroupDebt(req); // Get group debts of the user
        let settledInEveryGroup = false;
        for (const group in groupDebt) {
            if (groupDebt[group] !== 0) {
                settledInEveryGroup = false;
                break;
            }
            else{
            settledInEveryGroup = true;
            }
        }
        const formattedPhoneNumber = user.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        let phoneExists = false;
        if (req.query.phoneExists) {
            phoneExists = true;
        }
        let deleteAccountAuthenticated = false;
        if (req.session.deleteAccountAuthenticated) {
            deleteAccountAuthenticated = true;
            delete req.session.deleteAccountAuthenticated;
        }
        let deleteAccountError = false;
        if (req.query.deleteAccountError) {
            deleteAccountError = true;
        }

        res.render('settings', {
            username: user.username,
            phoneNumber: formattedPhoneNumber,
            profilePic: req.session.profilePic,
            email: user.email,
            editMode: false,
            path: req.path,
            phoneExists: phoneExists,
            settledInEveryGroup: settledInEveryGroup,
            deleteAccountAuthenticated: deleteAccountAuthenticated,
            deleteAccountError: deleteAccountError,
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
        const { password } = req.body;


        const user = await User.findById(req.session.userId);// Find user by id


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);// Hash the password
        user.password = hashedPassword;// Set the password to the hashed password

        await user.save();// Save the user
        res.redirect('/settings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
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
        const phoneInDB = await User.findOne({ phone: phone });// Find user by phone number
        let phoneExists = phoneInDB ? true : false;
        if (phoneExists) {
            res.redirect('/settings?phoneExists=true');
        }
        else {
            const user = await User.findById(req.session.userId);// Find user by id
            user.phone = phone;
            await user.save();// Save the user

            req.session.phone = phone;

            res.redirect('/settings');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/settings/deleteAccountAuthenticate', async (req, res) => {
    try {
        const { deletePassword } = req.body;
        const user = await User.findById(req.session.userId);
        let passwordMatch = await bcrypt.compare(deletePassword, user.password);// Compare the password
        if (!passwordMatch) {
            return res.redirect('/settings?deleteAccountError=true');
        }
        else {
            req.session.deleteAccountAuthenticated = true;
            res.redirect('/settings');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }   
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
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), saltRounds);// Generate a random password
        await User.findByIdAndUpdate(req.session.userId, {// Update the user information with a deleted email, username, and random password
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
