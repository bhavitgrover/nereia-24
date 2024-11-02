const router = require('express').Router()

router.get('/', async (req,res) => {
    res.render('discoveries', {user:req.user})
})

router.post('/uploadAvatar', async (req,res) => {
    console.log(req.body)
    // TODO: needa complete this
    res.redirect('/discoveries')
})

module.exports = router