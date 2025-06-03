const mongoose =require("mongoose")

const coureseProgress=new mongoose.Schema({
         courseID:{ 
            type:mongoose.Schema.Types.ObjectId,
                ref:"course"
         },
         CompletedVideos:[{
            type:mongoose.Schema.Types.ObjectId,
                ref:"subSection"

         }]

});

module.exports=mongoose.model("coureseProgress",coureseProgress)