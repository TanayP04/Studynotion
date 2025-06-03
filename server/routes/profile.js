const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middleware/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controller/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteAccount", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getAllUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
 router.get("/getEnrolledCourses", auth, getEnrolledCourses)
 router.put("/updateDisplayPicture", auth, updateDisplayPicture)
 router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router