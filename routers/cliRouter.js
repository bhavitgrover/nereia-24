const router = require('express').Router();

router.get('/', (req,res) => {
    res.render('cli', {user: req.user});
})

module.exports = router;