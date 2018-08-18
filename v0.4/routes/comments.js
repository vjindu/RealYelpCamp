var express = require("express");
var router = express.Router();
var Comment = require("../models/comment.js");
var Campground = require("../models/campgrounds.js");
var Users = require("../models/user.js");
var mongoose = require("mongoose");

// ==========================
// COMMENTS Routes
// isLoggedIn, 
// ==========================

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    console.log("We are in create new comments page");
    const parmID = mongoose.Types.ObjectId(req.params.id);
    console.log("paramID is as follows \n")
    console.log(parmID);
    //Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground) {

    Campground.findOne({ _id: parmID }, function(err, findCampground) {
        if (err) {
            console.log("This is addcomments place. There is an error in finding the ID of the page");
            console.log(err);
        } else {
            res.render("comments/addComment.ejs", { campground: findCampground });
        }
    });
    console.log("rendering the comments page");
});

router.post("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    var author = {
        id: res.locals.currentUser._id,
        username: res.locals.currentUser.userName
    }
    Comment.create({ comment: req.body.description, author: author }, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            Campground.findById(req.params.id, function(err, findCampground) {
                if (err) {
                    console.log(err);
                } else {
                    findCampground.comments.push(comment);
                    findCampground.save();
                    var idfound = findCampground._id;
                    console.log(findCampground.comments);
                    console.log("added new comment");
                    res.redirect("/campgrounds/" + findCampground._id);
                }
            });
        }
    });

});



// Edit Comment REST - Edit
router.get("/campgrounds/:id/comments/:commentId/edit", CheckCommentOwnership, function(req, res) {
    Comment.findById(req.params.id, function(err, foundCampground) {
        res.render("comments/editCamp.ejs", { campground: foundCampground });
    });

});

// Update Comment REST - Update
router.put("/campgrounds/:id/comments/:commentId", CheckCommentOwnership, function(req, res) {

    Comment.findByIdAndUpdate(req.params.commentId, req.body.campGnd, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete Comment REST - Destroy
router.delete("/campgrounds/:id/comments/:commentId", CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds" + req.params.id);
        } else {
            res.redirect("/campgrounds" + req.params.id);
        }
    });

});





// Functions - middleware
function isLoggedIn(req, res, next) {
    if (!res.locals.currentUser) {
        console.log("No one is logged in");
        res.redirect("/login");
    } else {
        next();
    }
};


// Functions - middleware - CheckCampgroundOwnership 
function CheckCommentOwnership(req, res, next) {
    if (res.locals.currentUser) {
        Comment.findById(req.params.id, function(err, foundComment) {
            if (err) {
                console.log("There is an error in finding the ID of the page");
                console.log(err);
                res.redirect("back");
            } else {
                console.log(res.locals.currentUser._id);
                console.log(foundComment.author.id);
                if (foundComment.author.id.equals(res.locals.currentUser._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });

    } else {
        res.redirect("back");
    }
};




module.exports = router;