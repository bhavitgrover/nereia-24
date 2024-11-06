const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const messageSchema = mongoose.Schema({
    from: reqString,
    to: reqString,
    content: reqString,
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("Message", messageSchema)