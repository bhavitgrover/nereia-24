const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const researcherSchema = mongoose.Schema({
    userId: reqString
})

module.exports = mongoose.model("Researcher", researcherSchema)