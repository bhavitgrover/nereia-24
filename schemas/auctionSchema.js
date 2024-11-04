const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const auctionSchema = mongoose.Schema({
    createdBy: reqString,
    product: reqString,
    description: reqString,
    image: reqString,
    biddingPrice: {type: Number, required: true},
    highestBidder: reqString,
    createdAt: { type: Date, default: Date.now },
    live:{ type: Boolean, default: false},
    sold: { type: Boolean, default: false }
})

module.exports = mongoose.model("Auction", auctionSchema)