const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    password: {type: String, required: true},
    forename: {type: String},
    surname: {type: String},
})

module.exports = mongoose.model("User", userSchema)