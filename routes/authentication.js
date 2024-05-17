const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { registrationSchema } = require('../models/UserRegistration');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    const errorMessage = req.query.error;

    res.render('index.ejs', { error: errorMessage });
})

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/?error=invalid_login');
        }

        var passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.redirect('/?error=invalid_login');
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.profilePic = user.profileImage ? `/profileImage/${user._id}` : `/images/homepageIconsAndPlaceholders/profilePicPlaceholder.svg`;
        req.session.authenticated = true;
        req.session.authorisation = user.authorisation;
        res.redirect('/home')
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).send('Error logging in')
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get("/register", (req, res) => {
    const incorrectFields = req.query.error ? req.query.error.split(',') : [];
    res.render('register.ejs', { error: incorrectFields });
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
        req.session.profilePic = newUser.profileImage ? `/profileImage/${newUser._id}` : `/images/homepageIconsAndPlaceholders/profilePicPlaceholder.svg`;
        req.session.username = newUser.username;
        req.session.authorisation = newUser.authorisation;

        res.redirect('/home');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user.');
    }
});

module.exports = router