const section = require("../models/section");
const course = require("../models/course");
const subSection = require("../models/subSection");

exports.createSection = async (req, res) => {
    try {
      
        //data fetch
        const {
            sectionName,
            courseId
        } = req.body

        //data validation

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })

        }
        //create section
        const newSection = await section.create({ sectionName });
        //update course with section id

        const updatedCourseDetails = await course.findOneAndUpdate({ _id: courseId }, {
            $push: { courseContent: newSection }
        },
            { new: true },).populate("courseContent");
        //return response
        return res.status(200).json({
            success: true,
            message: "section created successfully",
            data: updatedCourseDetails,
           
        })
    }
    catch (error) {
        console.log("error",error)
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message
        })

    }
}


exports.updateSection = async (req, res) => {    
    try {
        //data fetch
        const {sectionName,sectionID}=req.body
        //data validate
        if(!sectionName || !sectionID){
            return res.status(400).json({    
                success:false,
                message:"all fields are required"
            })
        }
        //update data
        const updateSectionDetails=await section.findByIdAndUpdate(sectionID,{sectionName},{new:true});

        //return response
            return res.status(200).json({
                success:true,
                message:"section updated successfully",
                data:updateSectionDetails
            })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to upodate section",
            error: error.message
        })

    }
}




exports.deleteSection = async (req, res) => {
    try {

        //get ID - assuming that we are sending section id in  Paramteter
        const {sectionID}=req.params
        
        //delete section
       await section.findByIdAndDelete(sectionID);
        //todo do we need to delete from course schema also

        //return response
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section",
            error: error.message
        })
    }
}