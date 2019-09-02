var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Mountain",
        image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732973dd904ecd50_340.jpg",
        description: "Pellentesque commodo eros a enim. Proin faucibus arcu quis ante. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Praesent egestas neque eu enim. Nunc sed turpis."
    },
    {
        name: "Forest",
        image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744f732772d39445cd_340.jpg",
        description: "Pellentesque commodo eros a enim. Proin faucibus arcu quis ante. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Praesent egestas neque eu enim. Nunc sed turpis."
    },
    {
        name: "Lake",
        image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c732973dd904ecd50_340.jpg",
        description: "Pellentesque commodo eros a enim. Proin faucibus arcu quis ante. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Praesent egestas neque eu enim. Nunc sed turpis."
    }
];

function seedDB() {
    // Campground.deleteMany({}, function(err) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         console.log("Campground db cleaned");
    //     }
        
    //     data.forEach(function(seed) {
    //         Campground.create(seed, function(err, campground) {
    //             if(err) {
    //                 console.log(err);
    //             } else {
    //                 console.log("Added campground");
                    // create comment
                    // Comment.create(
                    //     {
                    //         text: "This place is wonderful",
                    //         author: "Uther" 
                    //     }, function(err, comment) {
                    //         if(err) {
                    //             console.log(err);
                    //         } else {
                    //             campground.comments.push(comment);
                    //             campground.save();
                    //             console.log("Comment created");
                    //         }
                    // });
    //             }
    //         });
    //     });
    // });
}

module.exports = seedDB;
