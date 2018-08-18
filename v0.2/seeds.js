var mongoose = require("mongoose");

var Campground = require("./models/campgrounds"); // importing the designed schema
var Comments = require("./models/comments.js");

var data = [{
        name: "riverkreek",
        image: "https://c1.staticflickr.com/4/3670/10018397074_f925162ecb_b.jpg",
        description: "river Creek is a great place to camp"
    },
    {
        name: "Camporee",
        image: "https://c1.staticflickr.com/8/7661/17293711022_e749003f03_b.jpg",
        description: "Cool camping site next to the mountains with nice view"
    },
    {
        name: "Chimney Rock",
        image: "https://c1.staticflickr.com/9/8646/16413541657_15938c7e79_b.jpg",
        description: "Located in Joshua tree national park, Chimney rock - Hidden valley. Great hidden place to look out for"
    },
    {
        name: "BenNevis Summit Camp",
        image: "https://c1.staticflickr.com/6/5567/15068323371_5d60da4e5d_b.jpg",
        description: "Ben Navis summit has great views with mountain landscape. Its a lovely place to camp."
    },
    {
        name: "Georgina Bay Camping",
        image: "https://c1.staticflickr.com/8/7388/9460869290_86ee755408_c.jpg",
        description: "located at georgian bay, Ontario Canada, This is a great place to camp at. Provided with cool lighting."
    }

];


function seedDB() {
    //Step 1.  Remove all campgrounds
    Comments.remove({}, function(err) {
        if (err) {
            console.log("comments could not be removed");
            console.log(err);
        }
    });
    Campground.remove({}, function(err) {
        if (err) {
            console.log("Old campgrounds removal didnt workout well");

        } else {
            console.log("succesfully removed old campgronds");

            //Step 2.  Make totally new cmapgrounds
            data.forEach(function(subData) {
                Campground.create(subData, function(err, newAdded) {
                    if (err) {
                        console.log(err);

                    } else {
                        console.log(newAdded);

                        // Step 3. adding a comment for each campground
                        Comments.create({
                            comment: "you can start adding comments here",
                            author: "admin"
                        }, function(err, addedComment) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(addedComment);
                                newAdded.comments.push(addedComment);
                                newAdded.save();
                                console.log("Created a new comment");
                            }
                        });

                    }
                })
            })
        }



    });


}

module.exports = seedDB;