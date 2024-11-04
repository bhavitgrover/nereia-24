const router = require('express').Router()

router.get('/', async (req,res) => {
    res.render('shop', {title:'Shop', user:req.user})
})

module.exports = router