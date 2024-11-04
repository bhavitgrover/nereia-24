const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const auctionSchema = mongoose.Schema({
    createdBy: reqString,
    product: reqString,
    description: reqString,
    image: reqString,
    biddingPrice: reqString,
    highestBidder: reqString,
    createdAt: { type: Date, default: Date.now },
    sold: { type: Boolean, default: false }
})

module.exports = mongoose.model("Auction", auctionSchema)