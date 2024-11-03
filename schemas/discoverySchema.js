const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const discoverySchema = mongoose.Schema({
    userId: reqString,
    title: reqString,
    description: reqString,
    author: reqString,
    role: reqString,
    avatar: reqString,
    createdAt: { type: Date, default: Date.now },
    important: { type: Boolean, default: false }
})

module.exports = mongoose.model("Discovery", discoverySchema)