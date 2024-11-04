const router = require('express').Router(),
    Wallet = require('../schemas/walletSchema'),
    newWallet = require('../utils/blockchain/wallet'),
    {generateKeyPairSync} = require('crypto')

router.get('/', async (req, res) => {
    // const allWallets = await Wallet.find()
    // console.log(allWallets)
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