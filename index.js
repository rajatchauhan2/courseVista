const express = require("express")
const app = express();

const userRoutes =("./routes/User")
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require ("./routes/Payments")
const courseRoutes = require ("./routes/Course");


const database = require("./config/db.config");
const cookieParser = require ("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");


dotenv.config()
const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http:localhost:3000",
        credentials:true,

    })

)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",

    })
)

//cloudinaryConnect();
cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);


app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to the E-Learning Platform",
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
