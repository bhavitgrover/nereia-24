
require('dotenv').config()
const router = require('express').Router(),
    Wallet = require('../schemas/walletSchema'),
    newWallet = require('../utils/blockchain/wallet'),
    Block = require('../schemas/blockSchema'),
    {generateKeyPairSync} = require('crypto'),
    {createBlock} = require('../utils/blockchain/blockchain'),
    Nerit = require('../schemas/neritSchema'),
    Auction = require('../schemas/auctionSchema'),
    Users = require('../schemas/userSchema')
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
    // console.log(createBlock('bhavit', 'arti chopra', 100, '627890c9042459af1db065dfb465e69113c53a0e2be2c5dd12b52172e2abbf7f'))
    const reqWallet = await Wallet.findOne({mongooseId: req.user.id})
    const nerits = await Nerit.find()
    let reqNerit;
    for (let i = 0; i < nerits.length; i++) {
        if (nerits[i].date.getDate() == new Date().getDate()) {
            console.log('found')
            reqNerit = nerits[i]
        }
    }
    if (!reqNerit) {
        console.log('here')
        reqNerit = nerits[nerits.length - 1]
    }
    console.log(nerits)
    const transactions = await Auction.find({highestBidder: req.user.email})
    console.log(transactions)
    res.render('nerit', {user: req.user, wallet: reqWallet, nerit: reqNerit.neritValue, nerits: JSON.stringify(nerits), transactions: transactions})
})

router.get('/pay', async (req,res) => {
    const foundWallet = await Wallet.findOne({mongooseId: req.user.id})
    const allBlocks = await Block.find().sort({timeStamp: 'desc'})
    const lastBlock = allBlocks[0]
    var lastHash = 'none'
    if (lastBlock) {
        lastHash = lastBlock.hash
    }
    createBlock('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudltxCRk7Qdgor+3kpLRZUO2W+QOa6Cw7X5yn6yAlyRrjXFUjQSVtu1AMjozvwOt+eAy4dCizY91Khzn4KvI+AEwrV3QSX32DhHh92usXGAV4XAZF1a4v+totgGdeSt8CI/G7oyrEptuBtUWLY7cd43iXdXPntqBftqyPHaA355BHJuN7XJc1qc0YmTwAiVGKYrMS86mzCjeXLj+pDDM72QX/0q8FbOTZyhFVQWsalz4neAx4Ca2w8XJy62+sxfL4xtyvs7bdcoOgvmezaW1yQ0aXKmhVXi4kQfvKzah1ZjQndUpBPbEoHloqWV79AeJT9Z9E+oD6GmD1+A343JXEwIDAQAB', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmxKd5/oakDDG8MJPoQ2kNqcI7itzW8jk578R9MpkxidTEriRYiQ55Ys9+th5YKXNWzqXpcvuquUdTR7+WjF+ayEiko48S5y/qBD1n/RFcoJAMWjWHxLoASDyc8yHuBc7b32gLy1SepFC2mn5WVo4HKHZTDR39CIEr+w48ZZ1HTrbHRnoHkPgI165SNPifcJ5w0a2A0rgboycHuuE4YnbkWsVNcNbKSmpmVAbCch17shFLbBesIbcrY8pwqW/V+1vZpAaNUIxXxYn+Ng2HC+fT1eXS9pDEzMRy7SiGeuxVCaaXOctqjwA9vJwVeVI4iLMp8ElqGErWurxgbRfu+30/QIDAQAB', 100, lastHash, foundWallet.privateKey, foundWallet.publicKey)
    .then(resp => {
        const data = JSON.parse(resp)
        if (data.success) {
            res.send('transaction successful')
        } else {
            res.send(data.message)
        }
    })
})

router.get('/createWallet', (req, res) => {
    newWallet(req.user.id)
    .then(resp => {
        console.log(resp)
        if (resp) return res.redirect('/nerit')
        res.send('Something went wrong.')
    })
})

router.post('/buyNerit', async (req, res) => {
    const {amount} = req.body
    const nerits = await Nerit.find()
    let reqNerit;
    for (let i = 0; i < nerits.length; i++) {
        if (nerits[i].date.getDate() == new Date().getDate()) {
            console.log('found')
            reqNerit = nerits[i]
        }
    }
    if (!reqNerit) {
        console.log('here')
        reqNerit = nerits[nerits.length - 1]
    }
    const nerit = reqNerit.neritValue
    const totalMoney = Math.floor(nerit * amount)
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Nerit Tokens',
                    },
                    unit_amount: totalMoney * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/nerit/success?money=${amount}`,
            cancel_url: `${req.protocol}://${req.get('host')}/nerit`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Payment session creation failed' });
    }
})

router.get('/success', async (req, res) => {
    const {money} = req.query
    await Wallet.findOneAndUpdate({mongooseId: req.user.id}, {$inc: {money: money}})
    const nerits = await Nerit.find()
    let reqNerit;
    for (let i = 0; i < nerits.length; i++) {
        if (nerits[i].date.getDate() == new Date().getDate()) {
            console.log('found')
            reqNerit = nerits[i]
            console.log(nerits[i])
            console.log("req nerit id", reqNerit.id)
            await Nerit.findOneAndUpdate({date: reqNerit.date}, {$inc: {nerits: money}})
            console.log(money)
            const newReqNerit = await Nerit.findOne({date: reqNerit.date})
            console.log(newReqNerit)
        }
    }
    if (!reqNerit) {
        let prevNerit = nerits[nerits.length - 1]
        let newValue;
        if (prevNerit.nerits >= 50) {
            newValue = prevNerit.neritValue + ((prevNerit.nerits - 50) * 0.02)
        } else {
            newValue = prevNerit.neritValue - ((50 - prevNerit.nerits) * 0.02)
        }
        const newNerit = new Nerit({
            nerits: money,
            neritValue: newValue
        })
        newNerit.save()
    }
    res.redirect('/nerit')
})

router.get("/profile/:id", async(req,res) => {
    console.log(req.params.id)
    const userWallet = await Wallet.find({mongooseId:req.params.id})
    const user = await Users.find({_id:req.params.id})
    const transactions = await Auction.find({highestBidder: req.user.email})
    
    res.render('neritProfile', {userWallet, user, transactions})
})

module.exports = router