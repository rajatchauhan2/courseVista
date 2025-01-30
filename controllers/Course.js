const Course = require("../models/course.models");
const User = require("../models/user.models");
const Tag = require("../models/tags.models");
const { uploadImage } = require("../utils/imageUploader");

//create course handler function

exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnail;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all details",
      });
    }

    //store the object in the database
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("instructorDetails", instructorDetails);
    //TODO verify that userid is an instructor

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    //check tag details
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }
    //upload img cloudinary

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //userUpdate

    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: { courses: newCourse._id },
      }
    );
    //update the tag schema
    await Tag.findByIdAndUpdate(
      {
        _id: tagDetails._id,
      },
      {
        $push: { courses: newCourse._id },
      }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    log.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//getclourse handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor", "name email")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    log.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
