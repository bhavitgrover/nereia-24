const mongoose = require("mongoose");
const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };

const blockSchema = mongoose.Schema({
  hash: reqString,
  amount: reqNumber,
  payer: reqString,
  payee: reqString,
  nonce: reqNumber,
  previousHash: reqString,
  timeStamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Block", blockSchema);
