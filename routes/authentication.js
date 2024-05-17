const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { registrationSchema } = require('../models/UserRegistration');
const { passwordSchema } = require('../models/userPassword');
const bcrypt = require('bcrypt');
const { createTransport } = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const crypto = require('crypto');
const saltRounds = 12;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    process.env.REDIRECTURL
);
OAuth2Client.setCredentials({ refreshToken: process.env.REFRESHTOKEN });

async function createTransporter() {
    try {
        return createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USER,
                clientId: process.env.CLIENTID,
                clientSecret: process.env.CLIENTSECRET,
                refreshToken: process.env.REFRESHTOKEN,
                accessToken: await OAuth2Client,
            },
        });
    } catch (error) {
        console.error('Error creating transporter:', error);
        return null;
    }
}


router.get("/", (req, res) => {
    const errorMessage = req.query.error;
    const loginEmail = req.session.loginEmail || '';
    res.render('index.ejs', { error: errorMessage, loginEmail });
})

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.session.loginEmail = email;
            return res.redirect('/?error=invalidLogin');
        }

        var passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.session.loginEmail = email;
            return res.redirect('/?error=invalidLogin');
        }

        req.session.loginEmail = '';
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.profilePic = `/profileImage/${user._id}`;
        req.session.username = user.username;
        req.session.phoneNumber = user.phone;
        req.session.authenticated = true;
        req.session.authorisation = user.authorisation;
        res.redirect('/home')
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).send('Error logging in')
    }
})


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

router.get("/register", (req, res) => {
    const incorrectFields = req.query.error ? req.query.error.split(',') : [];
    const signUpFields = req.session.signUpFields || {};
    console.log(signUpFields);
    incorrectFields.forEach(field => {
        signUpFields[field] = '';
    });

    res.render('register.ejs', { error: incorrectFields, signUpFields });
});

router.post('/submitRegistration', upload.single('profileImage'), async (req, res) => {
    var { email, phone, username, password } = req.body;

    const incorrectFields = [];

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            incorrectFields.push('email');
        }

        const { error } = registrationSchema.validate({ email, phone, username, password }, { abortEarly: false });
        if (error) {
            const validationErrors = error.details.map(detail => detail.context.key);
            incorrectFields.push(...validationErrors);
            req.session.signUpFields = { email, phone, username, password };
        }

        if (incorrectFields.length > 0) {
            return res.redirect(`/register?error=${incorrectFields.join(',')}`);
        }
        let profileImage = null;
        if (req.file) {
            profileImage = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ email, phone, username, password: hashedPassword, profileImage });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.authenticated = true;
        req.session.profilePic = `/profileImage/${newUser._id}`;
        req.session.username = newUser.username;
        req.session.phoneNumber = newUser.phone;
        req.session.authorisation = newUser.authorisation;
        delete req.session.signUpFields;
        res.redirect('/home');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user.');
    }
});

router.get("/register", (req, res) => {
    const incorrectFields = req.query.error ? req.query.error.split(',') : [];
    res.render('register.ejs', { error: incorrectFields });
});

// Handle registration form submission
router.post('/submitRegistration', async (req, res) => {
    const { email, phone, username, password } = req.body;
    const incorrectFields = [];

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            incorrectFields.push('email');
        }

        const { error } = registrationSchema.validate({ email, phone, username, password }, { abortEarly: false });
        if (error) {
            const validationErrors = error.details.map(detail => detail.context.key);
            incorrectFields.push(...validationErrors);
        }

        if (incorrectFields.length > 0) {
            return res.redirect(`/register?error=${incorrectFields.join(',')}`);
        }
        let profileImage = null;
        if (req.file) {
            profileImage = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ email, phone, username, password: hashedPassword, profileImage });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.authenticated = true;
        req.session.profilePic = `/profileImage/${newUser._id}`;
        req.session.username = newUser.username;
        req.session.authorisation = newUser.authorisation;

        res.redirect('/home');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user.');
    }
});

router.get("/register", (req, res) => {
    const incorrectFields = req.query.error ? req.query.error.split(',') : [];
    res.render('register.ejs', { error: incorrectFields });
});

// Handle registration form submission
router.post('/submitRegistration', async (req, res) => {
    const { email, phone, username, password } = req.body;
    const incorrectFields = [];

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            incorrectFields.push('email');
        }

        const { error } = registrationSchema.validate({ email, phone, username, password }, { abortEarly: false });
        if (error) {
            const validationErrors = error.details.map(detail => detail.context.key);
            incorrectFields.push(...validationErrors);
        }

        if (incorrectFields.length > 0) {
            return res.redirect(`/register?error=${incorrectFields.join(',')}`);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ email, phone, username, password: hashedPassword });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.authenticated = true;
        req.session.authorisation = newUser.authorisation;
        res.redirect('/home');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user.');
    }
});

router.get("/reset", (req, res) => {
    const message = req.query.message;
    res.render('reset.ejs', { message });
});

router.post('/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/reset?error=checkEmail');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 3600000; // 1 hour from now

        user.resetPasswordToken = token;
        user.resetPasswordExpires = tokenExpiration;
        await user.save();

        const resetURL = `${process.env.REDIRECTURL}/reset/${token}`;
        const transporter = await createTransporter();

        const mailOptions = {
            to: user.email,
            from: process.env.USER,
            subject: 'Password Reset',
            text: `You are receiving this email because you may have requested a password reset for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.redirect('/reset?message=checkEmail');
    } catch (error) {
        console.error('Error processing password reset:', error);
        res.status(500).send('Error processing password reset.');
    }
});

router.get('/reset/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const errorMessage = req.query.error;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect('/reset?error=tokenInvalid');
        }

        res.render('resetForm.ejs', { token, error: errorMessage });
    } catch (error) {
        console.error('Error finding user for password reset:', error);
        res.status(500).send('Error finding user for password reset.');
    }
});

router.post('/reset/:token', async (req, res) => {
    const { password, confirmPassword } = req.body;

    // Validate password
    const { error } = passwordSchema.validate({ password });

    if (error) {
        const errorMessage = error.details[0].message;
        return res.redirect(`/reset/${req.params.token}?error=${encodeURIComponent(errorMessage)}`);
    }

    if (password !== confirmPassword) {
        return res.redirect(`/reset/${req.params.token}?error=passwordMismatch`);
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect('/reset?error=invalidOrExpiredToken');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.redirect('/reset?message=passwordResetSuccess');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password.');
    }
});

module.exports = router