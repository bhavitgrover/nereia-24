const mongoose = require('mongoose');
const reqString = { type: String, required: true };

const userSchema = mongoose.Schema({
    fname: reqString,
    lname: reqString,
    email: reqString,
    password: reqString,
    role: reqString,
    avatar: {
        type: String,
        default: "",
        required: false
    },
    lastSent: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("User", userSchema)