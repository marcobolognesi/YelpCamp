const express = require("express");
const router = express.Router({mergeParams:true});
const Campground  = require("../models/campground");
const Comment     = require("../models/comment");
const middleware  = require("../middleware/index");

//===============
// COMMENT ROUTES
//===============

// NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

// CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save comment
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success", "Comment added successfully!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
        }
    });
});
// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deleteComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 // check comment ownership
//                 if(foundComment.author.id.equals(req.user._id)){
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