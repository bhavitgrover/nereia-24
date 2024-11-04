function createBlock(payer, payee, amount, prevHash) {
  const date = Number(new Date());
  const hashPayload = JSON.stringify({
    transaction: {payer, payee, amount},
    timeStamp: date,
    prevHash: prevHash
  });
}
