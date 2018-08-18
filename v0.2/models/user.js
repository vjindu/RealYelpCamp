var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    userName = String,
    emailAddress = String,
    password = String
});

module.exports = mongoose.model("user", userSchema)