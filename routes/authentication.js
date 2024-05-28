const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { registrationSchema } = require('../models/UserRegistration');
const { passwordSchema } = require('../models/UserPassword');
const bcrypt = require('bcrypt');
const { createTransporter } = require('../controllers/mailer');
const crypto = require('crypto');
const saltRounds = 12;
const multer = require('multer');
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    const errorMessage = req.query.error;
    const loginEmail = req.session.loginEmail || '';
    const message = req.query.message;
    res.render('index.ejs', { error: errorMessage, loginEmail, message, path: req.path });
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.session.loginEmail = email;
            return res.redirect('/?error=invalidLogin');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.session.loginEmail = email;
            return res.redirect('/?error=invalidLogin');
        }

        if (!user.emailVerified) {
            req.session.loginEmail = email;
            return res.redirect('/?error=emailNotVerified');
        }

        req.session.loginEmail = '';
        req.session.userId = user._id;
        req.session.username = user.username;
        if (user.profileImage && user.profileImage.data) {
            const profileImageBase64 = user.profileImage.data.toString('base64');
            req.session.profilePic = `data:${user.profileImage.contentType};base64,${profileImageBase64}`;
        } else {
            req.session.profilePic = null;
        }

        req.session.phoneNumber = user.phone;
        req.session.email = user.email;
        req.session.authenticated = true;
        req.session.authorisation = user.authorisation;
        return res.redirect('/home');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

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
    incorrectFields.forEach(field => {
        signUpFields[field] = '';
    });

    res.render('register.ejs', { error: incorrectFields, signUpFields, path: req.path });
});

router.post('/submitRegistration', upload.single('profileImage'), async (req, res) => {
    const { email, phone, username, password } = req.body;
    const incorrectFields = [];

    try {
        const existingUser = await User.findOne({ email });
        const existingPhone = await User.findOne({ phone });

        if (existingUser) {
            incorrectFields.push('email');
        }

        if (existingPhone) {
            incorrectFields.push('phone');
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

        const profileImage = req.file ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
        } : null;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = Date.now() + 3600000; // 1 hour from now

        const newUser = new User({
            email,
            phone,
            username,
            password: hashedPassword,
            profileImage,
            emailVerificationToken,
            emailVerificationExpires
        });

        await newUser.save();

        // Send verification email
        const transporter = await createTransporter();
        if (!transporter) {
            console.error('Failed to create transporter');
            return res.status(500).send('Error sending verification email.');
        }

        const verificationURL = `${process.env.REDIRECTURL}/verify/${emailVerificationToken}`;
        const mailOptions = {
            to: newUser.email,
            from: process.env.USER,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: ${verificationURL}`
        };

        await transporter.sendMail(mailOptions);

        req.session.userId = newUser._id;
        req.session.authenticated = false;
        req.session.signUpFields = null;
        res.redirect('/?message=Please check your email for verification link.');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user.');
    }
});

router.get('/verify/:token', async (req, res) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect('/?error=invalidOrExpiredToken');
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        req.session.userId = user._id;
        req.session.authenticated = true;
        res.render('verificationSuccess', { path: req.path });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Error verifying email.');
    }
});

router.post('/resendVerification', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/?error=emailNotFound');
        }

        if (user.emailVerified) {
            return res.redirect('/?message=Your email is already verified. Please login.');
        }

        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = Date.now() + 3600000; // 1 hour from now

        user.emailVerificationToken = emailVerificationToken;
        user.emailVerificationExpires = emailVerificationExpires;
        await user.save();

        // Send verification email
        const transporter = await createTransporter();
        if (!transporter) {
            console.error('Failed to create transporter');
            return res.status(500).send('Error sending verification email.');
        }

        const verificationURL = `${process.env.REDIRECTURL}/verify/${emailVerificationToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.USER,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: ${verificationURL}`
        };

        await transporter.sendMail(mailOptions);

        res.redirect('/?message=Verification email resent. Please check your email.');
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).send('Error resending verification email.');
    }
});

router.get("/reset", (req, res) => {
    const message = req.query.message;
    res.render('reset.ejs', { message, path: req.path });
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

        if (!transporter) {
            console.error('Failed to create transporter');
            return res.status(500).send('Error sending reset email.');
        }

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

module.exports = router;
