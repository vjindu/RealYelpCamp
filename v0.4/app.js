var express = require("express");
var app = express();
var https = require("https");
var fs = require("fs");
var helmet = require("helmet");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var sessions = require("client-sessions");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
mongoose.connect('mongodb://localhost:27017/yelp_camp_v02');


// mongoDB: DB schema here: Campground / comments
var Campground = require("./models/campgrounds.js");
var Comment = require("./models/comment.js");
var Users = require("./models/user.js");
var seedDB = require("./seeds.js");
var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js");

var options = {
    key: fs.readFileSync("encryption/server.key"),
    cert: fs.readFileSync("encryption/server.crt")
        //key: fs.readFileSync("encryption/rootCA.key"),
        //cert: fs.readFileSync("encryption/rootCA.crt"),
        //ca: fs.readFileSync("encryption/intermediate.crt")
};

app.set("view engine", "ejs");
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
    cookieName: "loginSession",
    secret: "yololololoBLABLABLA", // secret
    duration: 30 * 60 * 1000,
}));

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public")); // using public directory

// Middleware runs globally for every request
app.use(function(req, res, next) {
    if (req.loginSession && req.loginSession.userId) {
        Users.findById(req.loginSession.userId, function(err, user) {
            if (err) {
                console.log(err);
            } else {

                console.log("User authenticated"); //user);
                res.locals.currentUser = user;
                next();
            }
        });
    } else {
        res.locals.currentUser = null;
        next();
    }
});

//seedDB();

app.use(commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);








https.createServer(options, app).listen(3000, function() {
    console.log("Brave new World More structured. More smarter");
});