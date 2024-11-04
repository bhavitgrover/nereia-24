const router = require('express').Router(),
    Wallet = require('../schemas/walletSchema'),
    newWallet = require('../utils/blockchain/wallet'),
    {generateKeyPairSync} = require('crypto'),
    {createBlock} = require('../utils/blockchain/blockchain')

router.get('/', async (req, res) => {
    console.log(createBlock('bhavit', 'arti chopra', 100, '627890c9042459af1db065dfb465e69113c53a0e2be2c5dd12b52172e2abbf7f'))
})

router.get('/createWallet', (req, res) => {
    newWallet(req.user.id)
    .then(resp => {
        console.log(resp)
        if (resp) return res.redirect('/nerit')
        res.send('Something went wrong.')
    })
})

module.exports = router