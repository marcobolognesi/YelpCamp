const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
// const Campground  = require("./models/campground");
// const Comment     = require("./models/comment");
const User        = require("./models/user");

//requiring routes
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");
// to populate db with initial data
// seedDB      = require("./seeds"),
// seedDB();

mongoose.connect("mongodb://localhost/yelp_camp_v12", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("ERROR: ", err.message);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Nel mezzo del cammin di nostra vita",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass the loginUser objext to all pages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});
