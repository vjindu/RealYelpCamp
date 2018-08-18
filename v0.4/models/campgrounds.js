var mongoose = require("mongoose");


// Mongoose schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]
        // Comments is an Array of struct element
})

// module.exports => function sending out the result kinda like return
module.exports = mongoose.model("Campground", campgroundSchema);