const router = require('express').Router(),
    Wallet = require('../schemas/walletSchema'),
    newWallet = require('../utils/blockchain/wallet'),
    Block = require('../schemas/blockSchema'),
    {generateKeyPairSync} = require('crypto'),
    {createBlock} = require('../utils/blockchain/blockchain')

router.get('/', async (req, res) => {
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

module.exports = router