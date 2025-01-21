const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

// Middleware to authenticate user requests
const auth = async (req, res, next) => {
  try {
    // Retrieve the token from cookies or Authorization header
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    // Check if the token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // Verify the token's validity
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Attach decoded user information to the request object
      req.user = decoded;
    } catch (error) {
      // Return error response if token is invalid
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle unexpected errors and return a generic error response
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Middleware to check if the user is a student
exports.isStudent = async (req, res, next) => {
  try {
        if(req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "This is Protected route for student only",
            });
        }
        next();
  } catch (error) {
    // Handle unexpected errors and return a generic error response
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



//isInstructor


exports.isInstructor = async (req, res, next) => {
  try {
        if(req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "This is Protected route for Instructor only",
            });
        }
        next();
  } catch (error) {
    // Handle unexpected errors and return a generic error response
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//isAdmin

exports.isAdmin = async (req, res, next) => {
  try {
        if(req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "This is Protected route for Admin only",
            });
        }
        next();
  } catch (error) {
    // Handle unexpected errors and return a generic error response
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




module.exports = auth;
