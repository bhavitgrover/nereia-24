const router = require('express').Router()
const Items = require('../schemas/auctionSchema.js')
const { ensureRole } = require('../utils/authenticate.js')


router.get('/', async (req,res) => {
    let itemList = await Items.find()
    console.log(itemList)
    res.render('shop', {title: 'Marketplace', user: req.user, itemList})
})

router.get('/add', ensureRole, (req,res) => {
    res.render('addItem', {title: 'Auction Items', user: req.user})
})

router.post('/add', async (req, res) => {
    let {name, price, image, description} = req.body
    let item = new Items({
        createdBy: req.user.email,
        product: name,
        description: description,
        price: price,
        image: image,
        biddingPrice: price,
        highestBidder: req.user.fname,
        live:false
    })
    await item.save()
    res.redirect('/shop')
})

router.get('/live/:id', async (req,res) => {
    let item = await Items.findOne({_id:req.params.id})
    // console.log(item)
    item.live = true
    await item.save()
    res.redirect('/shop')
})

module.exports = router