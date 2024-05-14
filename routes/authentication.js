const express = require("express")
const router = express.Router()
const User = require('../models/User')
const { registrationSchema } = require('../models/UserRegistration')
const bcrypt = require('bcrypt')
const saltRounds = 12

router.get("/login", (req, res) => {
    const errorMessage = req.query.error

    res.render('login.ejs', { error: errorMessage })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.redirect('/login?error=invalid_email')
        }

        var passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.redirect('/login?error=incorrect_password')
        }

        req.session.userId = user._id
        req.session.authenticated = true
        req.session.authorisation = user.authorisation
        res.redirect('/members')
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
    var { username, email, password } = req.body
    let missingField = []

    const { error } = registrationSchema.validate({ username, email, password }, { abortEarly: false })

    if (error) {
        const missingFields = error.details.map(detail => detail.context.key)
        return res.redirect(`/register?missing=${missingFields.join(',')}`)
    }

    if (!username) {
        missingField.push('username')
    }
    if (!email) {
        missingField.push('email')
    }
    if (!password) {
        missingField.push('password')
    }

    if (missingField.length > 0) {
        // Redirect back to the registration page with the missing fields
        return res.redirect(`/register?missing=${missingField.join(',')}`)
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new User({ username, email, password: hashedPassword })

        await newUser.save()
        
        req.session.userId = newUser._id
		req.session.authenticated = true
        req.session.authorisation = newUser.authorisation
        res.redirect('/members')
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).send('Error registering user.')
    }
})

function isValidSession(req) {
    if (req.session.authenticated) 
        return true
    else
        return false
}

function sessionValidation(req, res, next) {
    if (isValidSession(req))
        next()
    else
        res.redirect('/login')
}

module.exports = router