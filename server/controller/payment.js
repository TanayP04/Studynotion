// const { instance } = require("../config/razorpay");
// const course = require("../models/course");
// const user = require("../models/user");
// const mailSender = require("../utils/mailSender");
// const coureseEnrollmentEmail = require("../mail/templates/coureseEnrollmentEmail");



// //capture payment and initiate razor pay
// exports.capturePayment = async (req, res) => {
//     //get course ID
//     const { course_id } = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid CourseID
//     if (!course_id) {
//         return res.status(400).json({
//             success: false,
//             message: "provide valid id"
//         })
//     }

//     //valid courseDetails
//     let course;
//     try {
//         course = await course.findById(course_id);
//         console.log(course);
//         if (!course) {
//             return res.status(400).json({
//                 success: false,
//                 message: "could not find course"
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).json({
//             success: false,
//             message: "could not find course",
//             error: error.message
//         })

//     }
//     //user already pay for the same course
//     const uid = new mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//         return res.status(400).json({
//             success: false,
//             message: "user already enrolled"
//         })
//     }
//     //create order
//     const amount = course.price;
//     const currency = "INR";

//     const option = {
//         amount: amount * 100,
//         currency,
//         receipt: math.randon(Date.now()).toString(),
//         notes: {
//             courseId: course_id,
//             userId,
//         }

//     }


//     try {
//         //initiate payment using razor pay
//         const paymentResponse = await instance.orders.create(option);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             orderID: paymentResponse.id,
//             thumbnail: course.thumbnail,
//             currency: paymentResponse.currency,
//             message: "payment initiated",


//         })
//     }
//     catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "payment failed",
//         })

//     }


// };

// //verify signature of razor pay and server
// exports.verifySignature = async (req, res) => {

//     const webhookSecret = "123456789";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret)
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest("hex");

//     if (signature === digest) {
//         console.log("payment verified");

    
//     const { courseId, userId } = req.body.payload.payment.entity.notes;

//     try {

//         //find the course and enrool the studen in the course
//         const enrolledCourse = await course.findByIdAndUpdate(courseId, {
//             $push: { studentsEnrolled: userId }
//         }, { new: true });
//         if (!enrolledCourse) {
//             return res.status(500).json({
//                 success: false,
//                 message: "course not found",

//             })
//         }
//         console.log(enrolledCourse);

//         //fins the student and update the course enrolled
//         const enrolledStudent = await user.findByIdAndUpdate({ userId },
//             { $push: { courses: courseId } },
//             { new: true },)

//         console.log(enrolledStudent);

//         //send mail to student
//         const emailResponse = await mailSender(
//             enrolledStudent.email, 
//             "enrollment successful", 
//              "you have successfully enrolled in the course");
//              console.log(emailResponse);


//         return res.status(200).json({
//             success: true,
//             message: "signature  verified",
//     })

//     }
//     catch (error) {
//         return res.status(500).json({
//             success: false,
            
//             error: error.message
//         })
//     }

// }

// else{
//     return res.status(400).json({
//         success: false,
//         message: "invalid signature",
//     })
// }

// };