const express = require("express");
const router = express.Router();
const Campground  = require("../models/campground");
// const middleware = require("../middleware/index.js");
const middleware = require("../middleware");

//==================
// CAMPGROUND ROUTES
//==================
router.get("/", (req, res) => {
    // console.log(req.user);
    // get all campgrounds from the database
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

// NEW campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// CREATE campground
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, price:price, image:image, description:description, author: author};
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newCamp) {
        if(err) {
            console.log(err);
        } else {
            // console.log(newCamp);
            res.redirect("/campgrounds");
        }
    });
});

// SHOW campground
router.get("/:id", function(req, res) {
    // find the right campground id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});  
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        res.render("campgrounds/edit", {campground: foundCamp});
    });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var data = {name:name, price:price, image:image, description:description};
    Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCamp){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});

// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// };

// function checkCampgroundOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCamp){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 // check campground ownership
//                 if(foundCamp.author.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// };

module.exports = router;