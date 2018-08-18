var mongoose = require("mongoose");

// Comments 

var commentSchema = new mongoose.Schema({
    comment: String,
    author: String
});

module.exports = mongoose.model("Comment", commentSchema);