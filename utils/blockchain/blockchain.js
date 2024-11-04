const {createHash, createSign, constants, createVerify} = require('crypto'),
  Block = require('../../schemas/blockSchema'),
  Wallet = require('../../schemas/walletSchema')

async function createBlock(payer, payee, amount, prevHash, pvtKey, pubKey) {
  try {
    const date = Number(new Date());
    const hashPayload = JSON.stringify({
      transaction: {payer, payee, amount},
      timeStamp: date,
      prevHash: prevHash
    });
    const hash = createHash('SHA256').update(hashPayload).end().digest('hex')
    const pemPvtKey = `-----BEGIN PRIVATE KEY-----\n${pvtKey}\n-----END PRIVATE KEY-----`
  
    const sign = createSign('SHA256').update(hashPayload).end()
    const signature = sign.sign(pemPvtKey)
  
    const verify = createVerify('sha256')
    verify.update(hashPayload).end()
    const pemPubKey = `-----BEGIN PUBLIC KEY-----\n${pubKey}\n-----END PUBLIC KEY-----`
    const isValidated = verify.verify(pemPubKey, signature)
  
    if (isValidated) {
      const foundPayer = await Wallet.findOne({publicKey: payer})
      const foundPayee = await Wallet.findOne({publicKey: payee})
      const foundWallet = await Wallet.findOne({publicKey: pubKey, privateKey: pvtKey})
      if (!foundPayer || !foundPayee) {
        return JSON.stringify({success: false, message: "Invalid payer or payee"})
      }
      if (!foundWallet) {
        return JSON.stringify({success: false, message: 'Invalid public or private key'})
      }
      if (payee == foundWallet.publicKey || payer != foundWallet.publicKey) {
        return JSON.stringify({success: false, message: "You can't pay to yourself, or from someone else's account!"})
      }
      if (amount <= 0 || amount > foundWallet.money) {
        return JSON.stringify({success: false, message: 'Not enough money!'})
      }
      const newBlock = new Block({
        hash: hash,
        amount: amount,
        payer: payer,
        payee: payee,
        timeStamp: date,
        previousHash: prevHash
      })
      await Wallet.updateOne({publicKey: pubKey}, {
        $set: {
          money: foundWallet.money - amount
        }
      })
      await newBlock.save()
      return JSON.stringify({success: true})
    } else {
      return JSON.stringify({success: false, message: 'Error validating the transaction!'})
    }
  } catch (error) {
    console.log(error)
    return JSON.stringify({success: false, message: "There was an error. Please try again."})
  }
}

module.exports = {createBlock}
