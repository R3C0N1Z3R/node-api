const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    forename: {type: String, required: true},
    surname: {type: String, required: true},
})

module.exports = mongoose.model("User", userSchema)