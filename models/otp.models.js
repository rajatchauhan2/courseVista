const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
    otp:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:600
    }
});


//Send Verification Email

async function sendVerification (email,otp){
    try {
        const mailResponse = await mailSender(email,'Verification Email From CourseVista - ultimate Learning Hub',`<h1>Your OTP is ${otp}</h1>`);
        console.log("Email Send Successfull",mailResponse);
        
    } catch (error) {
        console.log("error accured sending mail",error.message);
        
    }
}

otpSchema.pre('save',async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
});



module.exports = mongoose.model('OTP', otpSchema);