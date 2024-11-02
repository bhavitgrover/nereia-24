const router = require('express').Router()
const User = require('../schemas/userSchema');
const Messages = require('../schemas/messageSchema');
const { ensureAuthenticated } = require('../utils/authenticate');


router.get('/', async (req,res) => {
    // console.log(req.user)
    res.render('chat', {title:'welcome', user:req.user})
})
router.get('/:id', async (req,res) => {
    // console.log(req.user)
    const receiver = await User.findById(req.params['id'])

    var messagesRec = await Messages.find({from: req.params['id'], to: req.user.id})
    var messagesSen = await Messages.find({to: req.params['id'], from: req.user.id})
    var messages = messagesRec.concat(messagesSen)
    messages.sort((a, b) => a.timestamp - b.timestamp);
    res.render('chat', {title:'welcome', user:req.user, receiver, messages})
})

router.post('/:id', ensureAuthenticated, async (req, res)=>{
    const mes = new Messages(req.body)
    await mes.save()
    res.redirect(`/chat/${req.params['id']}`)
})

module.exports = router