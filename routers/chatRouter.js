const router = require('express').Router()
const User = require('../schemas/userSchema');
const Messages = require('../schemas/messageSchema');
const { ensureAuthenticated } = require('../utils/authenticate');


router.get('/', async (req,res) => {
    // console.log(req.user)
    const user = req.user
    const allUsers = await User.find({})
    const unreadUsers = []
    const allMessages = await Messages.find()
    for (let i = 0; i < allMessages.length; i++) {
        if (!allMessages[i].read && allMessages[i].from != user.id && !unreadUsers.includes(allMessages[i].from)) {
            unreadUsers.push(allMessages[i].from)
        }
    }
    res.render('chat', {title:'welcome', user, receiver:null, allUsers, unreadUsers})
})
router.get('/:id', async (req,res) => {
    const user = req.user
    const receiver = await User.findById(req.params['id'])
    const allUsers = await User.find({})
    const unreadUsers = []
    const allMessages = await Messages.find()
    for (let i = 0; i < allMessages.length; i++) {
        if (!allMessages[i].read && allMessages[i].from != user.id && !unreadUsers.includes(allMessages[i].from)) {
            unreadUsers.push(allMessages[i].from)
        }
    }
    console.log(unreadUsers)
    var messagesRec = await Messages.find({from: req.params['id'], to: user.id})
    var messagesSen = await Messages.find({to: req.params['id'], from: user.id})
    var messages = messagesRec.concat(messagesSen)
    for (let i = 0; i < messagesRec.length; i++) {
        await Messages.findByIdAndUpdate(messagesRec[i].id, {
            $set: {
                read: true
            }
        })
    }
    messages.sort((a, b) => a.timestamp - b.timestamp);
    res.render('chat', {title:'welcome', user:user, receiver, messages, allUsers, unreadUsers})
})

router.post('/:id', ensureAuthenticated, async (req, res)=>{
    const mes = new Messages(req.body)
    await mes.save()
    res.redirect(`/chat/${req.params['id']}`)
})

module.exports = router