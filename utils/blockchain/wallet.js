const { response } = require('express')
const Wallet = require('../../schemas/walletSchema'),
    {generateKeyPairSync} = require('crypto')

async function newWallet(id) {
    try {
        const keyPair = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'der' },
            privateKeyEncoding: { type: 'pkcs8', format: 'der' }
        })
        const publicKey = keyPair.publicKey.toString('base64'),
            privateKey = keyPair.privateKey.toString('base64')
        const myWallet = new Wallet({
            mongooseId: id,
            publicKey,
            privateKey
        })
        await myWallet.save()
        return true
    } catch (error) {
        console.log(error)
        return false    
    }
}

module.exports = newWallet