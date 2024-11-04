const {createHash} = require('crypto')

function createBlock(payer, payee, amount, prevHash) {
  const date = Number(new Date());
  const hashPayload = JSON.stringify({
    transaction: {payer, payee, amount},
    timeStamp: date,
    prevHash: prevHash
  });
  const hash = createHash('SHA256').update(hashPayload).end().digest('hex')
  return hash
}

module.exports = {createBlock}
