const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const userSchema = mongoose.Schema({
    fname: reqString,
    lname: reqString,
    email: reqString,
    password: reqString,
    role: reqString
})

module.exports = mongoose.model("User", userSchema)