const router = require('express').Router()

router.get('/', async (req,res) => {
    console.log(req.user._id)
    res.render('index', {title:'welcome', user:req.user})
})

module.exports = router