var express = require("express");
var router = express.Router();
var Users = require("../models/user.js");
var bcrypt = require("bcryptjs");
// Rendering home page
router.get("/", function(req, res) {
    console.log("you are in home page");
    res.render("homePage.ejs");
});
/* --------------
Authentication - Section
-----------------*/

// register users
router.get("/register", function(req, res) {
    console.log("you are in register page");
    res.render("register.ejs");
});

router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    console.log("you are in login page");
    res.render("login.ejs");
});

router.post("/login", function(req, res) {
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

router.get("/logout", isLoggedIn, function(req, res) {
    console.log(req.loginSession.userId);
    req.loginSession.reset();
    console.log(req.loginSession.userId);
    res.redirect("/login");
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




module.exports = router;