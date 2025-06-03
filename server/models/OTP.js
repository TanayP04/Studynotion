const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const OTP = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now,
            expires:5*60,
        },
        

});

    // a function to send email
  async function sendVerification(email,otp){
    try{
        const mailResponse =await mailSender(email,"verification Email From StudyNotion",otp);
                console.log("email sent successfully:",mailResponse)
    }
    catch(error){
        console.log("errror occured while sending mail",error);
        throw error;
    }
  }

OTP.pre("save",async function(next){
     await sendVerification(this.email,this.otp);
     next();
})




module.exports=mongoose.model("OTP",OTP)