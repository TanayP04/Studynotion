const mongoose = require("mongoose");
const section = require("./section");
const tag = require("./category");

const course = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,

    },
    courseDescription: {
        type: String,
        required: true,
        trim: true,

    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },

      whatYouWillLearn:{
        type: String,

      },

    courseContent:[ {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "section"
    }],
   ratingAndReviews :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ratingAndReviews"

    }],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tags: {
        type:[String]

    },
    
       
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    studentEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"

    }],
    instruction:{
       type:String, 
    },

    status: {
        type: String,
        enum: ["draft", "published"],
    },

   
    
     


});

module.exports = mongoose.model("course", course)