var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds.js");
var Users = require("../models/user.js");

/* ----------------
Campgrounds section - Section
-------------------*/

// Index of all campgrounds REST - INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds.ejs", { campgrounds: allCampgrounds });
        }
    })
    console.log("Restful route: Index all the campgrounds");
});

// Create New campground REST - NEW - Showing NEW Form
router.get("/new", isLoggedIn, function(req, res) {
    console.log(res.locals.currentUser);
    res.render("campgrounds/newCamps.ejs");

});

// Create new Campground REST - CREATE - Post 
router.post("/new", isLoggedIn, function(req, res) {

    var author = {
        id: res.locals.currentUser._id,
        username: res.locals.currentUser.userName
    }

    Campground.create({ name: req.body.name, image: req.body.image, description: req.body.description, author: author }, function(err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(newCampground);
            res.redirect("/campgrounds");
        }
    });
});

// Show one campground info REST - SHOW
router.get("/:id", function(req, res) {
    // find the campground with provided ID. and populate the comments added
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground) {
        if (err) {
            console.log("There is an error in finding the ID of the page");
            console.log(err);
        } else {
            console.log("in showinfo.ejs page");
            //res.send("No clue why aint working");
            res.render("campgrounds/showInfo.ejs", { campground: findCampground });
        }
    });
});


// Edit campground info REST - Edit
router.get("/:id/edit", CheckCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/editCamp.ejs", { campground: foundCampground });
    });

});

// Update Campground REST - Update
router.put("/:id", CheckCampgroundOwnership, function(req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campGnd, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

// Delete campground REST - Destroy
router.delete("/:id", CheckCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });

});

// Functions - middleware - is logged in

function isLoggedIn(req, res, next) {
    if (!res.locals.currentUser) {
        console.log("No one is logged in");
        res.redirect("/login");
    } else {
        next();
    }
};

// Functions - middleware - CheckCampgroundOwnership 
function CheckCampgroundOwnership(req, res, next) {
    if (res.locals.currentUser) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log("There is an error in finding the ID of the page");
                console.log(err);
                res.redirect("back");
            } else {
                console.log(res.locals.currentUser._id);
                console.log(foundCampground.author.id);
                if (foundCampground.author.id.equals(res.locals.currentUser._id)) {
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