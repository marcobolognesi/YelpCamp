var mongoose = require("mongoose");

// schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    location: String,
    lat: Number,
    lon: Number,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstname: String,
        username: String  
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);