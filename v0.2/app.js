var express = require("express");
var app = express();


var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp_camp_v02');


// mongoDB: DB schema here: Campground / comments
var Campground = require("./models/campgrounds.js");
var Comments = require("./models/comments.js");
var seedDB = require("./seeds.js");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


//seedDB();

// Rendering home page
app.get("/", function(req, res) {
    res.render("homePage.ejs");
});

// Index of all campgrounds REST - INDEX
app.get("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
    res.render("newCamps.ejs");

});

// Create new Campground REST - CREATE - Post 
app.post("/campgrounds/new", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    Campground.create({ name: name, image: image, description: description }, function(err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
            console.log(newCampground);
        }
    })
});


// Show one campground info REST - SHOW
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided ID. and populate the comments added
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground) {
        if (err) {
            console.log("There is an error in finding the ID of the page");
            Console.log(err);
        } else {
            console.log("problem seems too be in the showInfo.ejs page");
            //res.send("No clue why aint working");
            res.render("showInfo.ejs", { campground: findCampground });
        }
    });
});


// ==========================
// COMMENTS Routes
// ==========================

app.get();

app.post("/campgrounds/:id/", function(req, res) {
    if (err) {
        console.log(err);

    }
});


app.listen(3000, function() {
    console.log("Brave new World More structured. More smarter");
});