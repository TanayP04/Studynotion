const ratingAndReviews = require("../models/ratingAndReviews");
const course = require("../models/course");
const user = require("../models/user");



//create rating and review handler function
exports.createRating = async (req, res) => {
    try {
        //get user ID\
        const userId = req.user.id;
        //fetch data from req body
        const { courseId, rating, review } = req.body;
        //check if user enrolled or not
        const courseDetails = await course.findOne(courseId, { studentsEnrolled: { $elemMAtch: { $eq: userId } } });
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "you are not enrolled in this course"
            })
        }

        //check if user already reviewed
        const alreadyReviewed = await ratingAndReviews.findOne({ course: courseId, user: userId });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "you already reviewed this course"
            })

        }

        //create rating and review
        const ratingReview = await ratingAndReviews.create({
            rating,
            review,
            course: courseId,
            user: userId
        })


        //update course with this rating/review
      const updatedCourseDetails=  await course.findByIdAndUpdate({ _id: courseId }, {
            $push: { ratingAndReviews: ratingReview._id }
        }, { new: true }
        )

        console.log(updatedCourseDetails);
//return response
        return res.status(200).json({
            success: true,
            message: "rating and review created successfully",
            data: ratingReview
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//get average rating handler function

exports.getAverageRating = async (req, res) => {
    try{
        //get course id
        const courseId = req.body.courseId
        //calculate average rating
        const result = await ratingAndReviews.aggregate([{
            $match: { 
                course: new mongoose.Types.ObjectId(courseId),

            }
        },
        {
            $group:{
                _id:null,
                averageRating :{$avg:"$rating"},
            }
        }
    ])
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }

            //if no rating found
            return res.status(200).json({
                success:true,  
                message:"average rating not found",  
                averageRating:0
            })

    }
    catch(error){
console.log(error);
return res.status(500).json({
    success:false,
    message:error.message
})
    }
}


//get all rating and review handler function
exports.getAllRating=async (req,res)=>{
    try{
        const allReviews=await ratingAndReviews.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image",
        })
        .populate({
            path:"course",
            select:"courseName"
        }).exec();
        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews
        });
    }
    catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}