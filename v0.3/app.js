var express = require("express");
var app = express();
var https = require("https");
var fs = require("fs");
var helmet = require("helmet");

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

// Rendering home page
app.get("/", function(req, res) {
    console.log("you are in home page");
    res.render("homePage.ejs");
});
/* --------------
Authentication - Section
-----------------*/

// register users
app.get("/register", function(req, res) {
    console.log("you are in register page");
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    var hashPass = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hashPass;
    Users.create({
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        password: req.body.password
    }, function(err, newUser) {
        if (err) {
            console.log(err);
            res.send("Email id already exists please try another one");
        } else {
            console.log(newUser);
            res.redirect("/campgrounds");
        }
    });
});


// user Login
app.get("/login", function(req, res) {
    console.log("you are in login page");
    res.render("login.ejs");
});

app.post("/login", function(req, res) {
    Users.findOne({
        emailAddress: req.body.emailAddress
    }, function(err, userAuth) {
        if (err || !userAuth || !bcrypt.compareSync(req.body.password, userAuth.password)) {
            console.log("Wrong ID or Password");
        } else {
            console.log("session id from the headder");
            console.log(userAuth);
            console.log(bcrypt.compareSync(req.body.password, userAuth.password));
            // Setting up a login session - cookie
            req.loginSession.userId = userAuth._id; // _id => unique monoDB id for the Users object
            console.log(req.loginSession.userId);
            console.log(userAuth._id);
            res.redirect("/campgrounds");
        }
    });
});

// user logout 

app.get("/logout", isLoggedIn, function(req, res) {
    console.log(req.loginSession.userId);
    req.loginSession.reset();
    console.log(req.loginSession.userId);
    res.redirect("/login");
});


/* ----------------
Campgrounds section - Section
-------------------*/

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
            console.log(err);
        } else {
            console.log("in showinfo.ejs page");
            //res.send("No clue why aint working");
            res.render("showInfo.ejs", { campground: findCampground });
        }
    });
});


// ==========================
// COMMENTS Routes
// isLoggedIn, 
// ==========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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
            res.render("addComment.ejs", { campground: findCampground });
        }
    });
    console.log("rendering the comments page");


});

app.post("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Users.findById(req.loginSession.userId, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log(user);
            req.body.author = user.userName;
        }
        Comment.create({ comment: req.body.description, author: req.body.author }, function(err, comment) {
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

});

// Functions - middleware

function isLoggedIn(req, res, next) {
    if (req.loginSession && req.loginSession.userId) {
        console.log("someone is logged in");
        Users.findById(req.loginSession.userId, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                console.log("User authenticated"); //user);
            }

        });
        next();
    } else {
        res.redirect("/login");
    }
};


https.createServer(options, app).listen(3000, function() {
    console.log("Brave new World More structured. More smarter");
});