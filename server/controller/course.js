const mongoose = require("mongoose");
const course = require("../models/course");
const user = require("../models/user");
const category = require("../models/category");
const {uploadImageToCloudinary} = require("../utils/imageUploader")
const fileUpload = require("express-fileupload");

//create courses handler function
exports.createCourse = async (req, res) => {
    try {
        // fetch data
        const {
            courseName,
            courseDescription,
            price,
            whatYouWillLearn,
            tag,
            category,
            instruction,  // Capture instructions properly
        } = req.body;

        // get thumbnail image from files
        const thumbnail = req.files?.thumbnailImage;

        // validation
        if (!courseName || !courseDescription || !price || !whatYouWillLearn || !tag || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await user.findById(userId);
        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instructor not found"
            });
        }
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);



// const tagIds = tagDetails.map(t => t._id);  // Extract tag IDs
const courseDetails = await course.create({
    courseName,
    courseDescription,
    price,
    whatYouWillLearn,
    tags: tag,  // Store the tag IDs instead of tag names
    thumbnail: thumbnailImage.secure_url,
    instructor: instructorDetails._id,
    category,
    instruction,  // Assuming it's a string
} ,console.log('Received instruction:', instruction)

);


        // add course to user schema of instructor
        await user.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: { courses: courseDetails._id }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: courseDetails
        });

    } catch (error) {
        console.log("Error creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


// get all\couses handler function

exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        })
            .populate("instructor")
            .exec();
        return res.status(200).json({
            success: true,
            message: "all courses fetched successfully",
            data: allCourses
        });
    }
    catch (error) {
        console.log("error",error)
        return res.status(400).json({
            success: false,
            message: "something went wrong",
            error: error.message
        });
    }
}

//get course details

exports.getCourseDetails = async (req, res) => {
    try {
        //get id
        const { courseId } = req.body;
        //find course details
        const courseDetails = await course.findById(courseId).populate({
            path: "instructor",
            populate: { path: "additionalDetails" }

        }).populate("ratingAndReviews")
       // .populate("studentsEnrolled")
        .populate("category")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" }
            }).exec();

            //validation
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:`course not found ${courseId}`
                })
            }
            return res.status(200).json({
                success:true,
                data:courseDetails,
                message:"course details fetched successfully"
            })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "something went wrong",
            error: error.message
        })

    }
}


//