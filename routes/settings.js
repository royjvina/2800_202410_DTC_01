const express = require("express")
const router = express.Router()



router.get('/settings', (req, res) => {
    const FormattedPhoneNumber = req.session.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    res.render('settings', { username: req.session.username, phoneNumber: FormattedPhoneNumber, profilePic: req.session.profilePic, email: req.session.email });
});



module.exports = router