const User = require("../models/user.models");
const otp = require("../models/otp.models");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    var generatedOtp = otpGenerator.genrate(6, {
      upperCase: false,
      specialChars: false,
      lowerCase: false,
    });
    console.log("OTP Generated: ", otp);

    //check unique OTP or NOT

    const result = await otp.findOne({ otp: generatedOtp });
    while (result) {
      generatedOtp = otpGenerator.genrate(6, {
        upperCase: false,
        specialChars: false,
        lowerCase: false,
      });
      result = await otp.findOne({ otp: generatedOtp });
    }
    const otpPayload = { email, otp: generatedOtp };

    //create an entry in Otp
    const otpBody = await otp.create(otpPayload);
    console.log(otpBody);
    //return response
    res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
      generatedOtp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: ("error accured try again", error.message),
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    //validate data

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //match password

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }
    //check user exist
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    //check otp

    const recentOtp = await otp
      .findOne({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent OTP: ", recentOtp);

    //otp validation
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}+${lastName}&background=%23f0f0f0`,
    });

    //return response
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: ("error accured try again", error.message),
    });
  }
  // Login

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      //get data

      //data validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      //check user exist
      const user = await User.findOne({ email }).populate("additionalDetails");
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      //token generation
      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          user: {
            email: user.email,
            id: user._id,
            role: user.role,
          },
        };
        const token = JsonWebTokenError.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        user.token = token;
        user.password = undefined;

        //password match
        //create cookie
        const otpions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ), 
          httpOnly: true,
        };
        res.cookie("token", token, otpions).status(200).json({
          success: true,
          message: "User Logged in successfully",
          token,
          user,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: ("error accured try again", error.message),
      });
    }
  };

  //change password
 // Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send email or notification (pseudo-code)
   await sendEmail(user.email, "Password Updated Successfully", "Your password has been updated.");

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
};

};
