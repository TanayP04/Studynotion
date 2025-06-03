const mongoose =require("mongoose")

const ratingAndReviews=new mongoose.Schema({
   user:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"user",
   },
   ratting:{
    type:Number,
    required:true,
   },
   review:{
    type:String,
    required:true,
   },



});

module.exports=mongoose.model("ratingAndReviews",ratingAndReviews)