const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const neritSchema = mongoose.Schema({
    nerits: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    neritValue: {
        type: Number,
        required: true,
        defaut: 40000
    }
})

module.exports = mongoose.model("Nerit", neritSchema)