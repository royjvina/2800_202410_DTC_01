const express = require("express")
const router = express.Router()
const User = require('../models/User')
const { registrationSchema } = require('../models/UserRegistration')
const bcrypt = require('bcrypt')
const saltRounds = 12

router.get("/", (req, res) => {
    const errorMessage = req.query.error

    res.render('index.ejs', { error: errorMessage })
})

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.redirect('/?error=invalid_email')
        }

        var passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.redirect('/?error=incorrect_password')
        }

        req.session.userId = user._id
        req.session.authenticated = true
        req.session.authorisation = user.authorisation
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
    var missingField = req.query.missing ? req.query.missing.split(',') : []
    res.render('register.ejs', { missing: missingField })

})

router.post('/submitRegistration', async (req, res) => {
    var { email, phone, username, password } = req.body

    const { error } = registrationSchema.validate({ email, phone, username, password }, { abortEarly: false })

    if (error) {
        const missingFields = error.details.map(detail => detail.context.key)
        return res.redirect(`/register?missing=${missingFields.join(',')}`)
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new User({ email, phone, username, password: hashedPassword })

        await newUser.save()
        
        req.session.userId = newUser._id
		req.session.authenticated = true
        req.session.authorisation = newUser.authorisation
        res.redirect('/home')
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).send('Error registering user.')
    }
})

module.exports = router