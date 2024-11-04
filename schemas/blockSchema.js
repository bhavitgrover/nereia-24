const mongoose = require("mongoose");
const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };

const blockSchema = mongoose.Schema({
  hash: reqString,
  amount: reqNumber,
  payer: reqString,
  payee: reqString,
  previousHash: reqString,
  timeStamp: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model("Block", blockSchema);
