const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// INDEX
router.get("/", (req, res) => {
    res.render("landing");
});

//============
// AUTH ROUTES
//============

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});
// sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            // req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
// show login form
router.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {  
});

// handling logout logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
});

module.exports = router;