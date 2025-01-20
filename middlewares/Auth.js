const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
        const token =
         req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }


    //verify token

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//student
exports.isStudent = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);    
    } catch (error) {
        
    }
};
module.exports = auth;
