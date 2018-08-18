var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("user", userSchema)