const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    accountType:{
        type: String,
        required: true,
        enum: ["Admin", "Student", "Instructor"]
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },
    courses:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Course"

    },
    Image:{
        type: String,
        required: true,

    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ]
});


module.exports = mongoose.model("User", userSchema);