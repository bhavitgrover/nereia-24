const router = require('express').Router()

router.get('/', async (req,res) => {
    res.render('index', {title:'welcome', user:req.user})
})

module.exports = router