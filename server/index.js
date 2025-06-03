
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
 //const contactRoutes = require("./routes/contact");
const profileRoutes = require("./routes/profile");  
const paymentRoutes = require("./routes/payment");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryconnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT=process.env.PORT || 4000;

//database connection
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    orgin:"http://localhost:3000", /////ver impoetant
}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));



//cloudinary connection
cloudinaryconnect();


//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);
//app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/payment", paymentRoutes);


//def route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your Server is up and running ......",
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});