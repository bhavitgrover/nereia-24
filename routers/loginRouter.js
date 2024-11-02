const router = require('express').Router(),
    passport = require('passport'),
    User = require('../schemas/userSchema')

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
}))

module.exports = router