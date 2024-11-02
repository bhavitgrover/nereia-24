const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const diverSchema = mongoose.Schema({
    userId: reqString
})

module.exports = mongoose.model("Diver", diverSchema)