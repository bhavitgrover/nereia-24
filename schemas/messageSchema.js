const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const messageSchema = mongoose.Schema({
    from: reqString,
    to: reqString,
    content: reqString,
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Message", messageSchema)