var express = require("express");

var app = express();

// body parser is used to get post data as a js string to the server 
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// setting view engine to ejs
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    //res.send("YOLO YOLO");
    res.render("homePage.ejs")
    console.log("Rendering Main page");
});


app.get("/campgrounds", function(req, res) {
    var campgrounds = [
            { name: "RiverSide", image: "images/img_01.jpg" }, { name: "SalmonCreek", image: "images/img_02.jpg" }, { name: "TrondheimHetta", image: "images/img_03.jpg" }
        ]
        //res.send("YOLO YOLO");
    res.render("campgrounds.ejs", { campgrounds: campgrounds });
    console.log("needs changing");
});

// Posting options
app.post("/campgrounds", function(req, res) {
    // Adding new camp grounds Possibly uploading pictures to mongo db in the future

    console.log("post routes for campgrounds. Adding new camp grounds");

});

/*app.get("*", function(req, res) {
    //res.send("Remove this link ASAP very dangerous");
    console.log("this page needs to be removed OR link directed to main page");
    res.send("/img_01.jpg");

}); */
app.listen(3000, function() {
    console.log("Real yelp camp app started serving b**ches");
});