const mongoose = require("mongoose");
const reqString = { type: String, required: true, unique: true };

const walletSchema = mongoose.Schema({
  mongooseId: reqString,
  publicKey: reqString,
  privateKey: reqString,
  money: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);
