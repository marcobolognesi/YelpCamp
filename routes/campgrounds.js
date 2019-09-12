const request = require("request");
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
    var location = req.body.location;
    var url = 'http://dev.virtualearth.net/REST/v1/Locations?query=' + location + '&key=' + process.env.GEOCODER_API_KEY;
    request(url, (error, response, data) => {
        if(error){
            console.log(error);
        } else {
            // console.log(data);
            if(response.statusCode == 200) {
                var parsedData = JSON.parse(data);
                var name = req.body.name;
                var price = req.body.price;
                var image = req.body.image;
                var description = req.body.description;
                var author = {
                    id: req.user._id,
                    firstname: req.user.firstname,
                    username: req.user.username
                };
                var lat = parsedData.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
                var lon = parsedData.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];      
                var newCampground = {name:name, price:price, location:location, lat:lat, lon:lon, image:image, description:description, author: author};
                
                // create a new campground and save to DB
                Campground.create(newCampground, function(err, newCamp) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.redirect("/campgrounds");
                    }
                });
            }
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
    var location = req.body.location;
    var url = 'http://dev.virtualearth.net/REST/v1/Locations?query=' + location + '&key=' + process.env.GEOCODER_API_KEY;
    request(url, (error, response, data) => {
        if(error){
            console.log(err);
        } else {
            if(response.statusCode == 200) {
                var parsedData = JSON.parse(data);
                var name = req.body.name;
                var price = req.body.price;
                var image = req.body.image;
                var description = req.body.description;
                var author = {
                    id: req.user._id,
                    firstname: req.user.firstname,
                    username: req.user.username
                };
                var lat = parsedData.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
                var lon = parsedData.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];      
                var update = {name:name, price:price, location:location, lat:lat, lon:lon, image:image, description:description, author: author};
                Campground.findByIdAndUpdate(req.params.id, update, function(err, updatedCamp){
                    if(err){
                        res.redirect("/");
                    } else {
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                });
            }
        }
    });
});

// DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
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