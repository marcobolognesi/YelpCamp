const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema ({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    city: String,
    state: String,
    zip: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);