const mongoose = require("mongoose");
const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };

const sosSchema = mongoose.Schema({
    userId: reqString,
    progress: reqString,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SOS", sosSchema);
