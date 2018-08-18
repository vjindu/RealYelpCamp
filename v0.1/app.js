// Adding express framework
var express = require("express");
var app = express();

//MongoDB -> connecting with mongoose
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp_camp');



// body parser is used to get post data as a js string to the server 
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// setting view engine to ejs
app.set("view engine", "ejs");


// Mongoose schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);
/* Test create

Campground.create({
    name: "Salmon Creek",
    image: "images/img_01.jpg",
    description: "this campground is very good for fishing. If you are a fishing enthusiast this is the place for you."

}, function(err, campground) {
    if (err) {
        console.log(err);
    } else {
        console.log("Newly created campground");
        console.log(campground);
    }
});
*/


// Non DB variables

/*var campgrounds = [
    { name: "RiverSide", image: "images/img_01.jpg" }, { name: "SalmonCreek", image: "images/img_02.jpg" }, { name: "TrondheimHetta", image: "images/img_03.jpg" }
];
*/



app.get("/", function(req, res) {
    //res.send("YOLO YOLO");
    res.render("homePage.ejs")
    console.log("Rendering Main page");
});


app.get("/campgrounds", function(req, res) {

    //res.send("YOLO YOLO");
    Campground.find({}, function(err, allCampgroundes) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds.ejs", { campgrounds: allCampgroundes });

        }
    });

    console.log("needs changing");
});

// Posting options
app.post("/campgrounds", function(req, res) {
    // Adding new camp grounds Possibly uploading pictures to mongo db in the future
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newCampground = { name: name, image: image, description: description };
    //campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);

        } else {
            res.redirect("/campgrounds");
            console.log(newlyCreated);
        }

    })


    console.log("post routes for campgrounds. Adding new camp grounds");

});

app.get("/campgrounds/new", function(req, res) {
    res.render("newCamps.ejs");

});

app.get("/campgrounds/campInfo/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("showInfo.ejs", { campground: foundCampground });
        }
    });
});

/*app.get("*", function(req, res) {
    //res.send("Remove this link ASAP very dangerous");
    console.log("this page needs to be removed OR link directed to main page");
    res.send("/img_01.jpg");

}); */
app.listen(3000, function() {
    console.log("Real yelp camp app started serving b**ches");
});