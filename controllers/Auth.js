const User = require("../models/user.models");
const Otp = require("../models/otp.models");
const Profile = require("../models/profile.models");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller to handle sending OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    let generatedOtp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      lowerCase: false,
    });
    console.log("OTP Generated: ", generatedOtp);

    let result = await Otp.findOne({ otp: generatedOtp });
    while (result) {
      generatedOtp = otpGenerator.generate(6, {
        // ✅ Fixed typo
        upperCase: false,
        specialChars: false,
        lowerCase: false,
      });
      result = await Otp.findOne({ otp: generatedOtp });
    }

    const otpPayload = { email, otp: generatedOtp };
    const otpBody = await Otp.create(otpPayload); // ✅ Fix: Use `Otp.create()`
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
      generatedOtp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error occurred: ${error.message}`,
    });
  }
};

// Controller to handle user sign-up
exports.signUp = async (req, res) => {
  console.log("📩 Received Signup Data in Backend:", req.body); // Debugging

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is empty!",
    });
  }
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      Otp: userOtp, // ✅ Rename to avoid conflict with model
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !userOtp // ✅ Use renamed variable
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        receivedData: req.body, // Debugging
      });
    }
    console.log("✅ Backend received all fields"); // Debugging

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ Fetch recent OTP and fix naming issue
    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    console.log("Recent OTP: ", recentOtp);

    // ✅ Correct OTP field name (recentOtp.otp, not recentOtp.Otp)
    if (!recentOtp || recentOtp.otp !== userOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error occurred: ${error.message}`,
    });
  }
};

// Controller to handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Validate the password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      // Generate a JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // Set the token in a cookie
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      console.log("JWT_COOKIE_EXPIRE:", process.env.JWT_COOKIE_EXPIRE);
      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);

    // Handle errors and return a failure response
    return res.status(500).json({
      success: false,
      message: `Error occurred: ${error.message}`,
    });
  }
};

// Controller to handle password change
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
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Ensure the new password matches the confirmation password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Update the user's password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Notify the user via email
    await sendEmail(
      user.email,
      "Password Updated Successfully",
      "Your password has been updated."
    );

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);

    // Handle errors and return a failure response
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
};
