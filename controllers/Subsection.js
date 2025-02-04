const SubSection = require("../models/subSection.models");
const Section = require("../models/section.models");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create SubSection

exports.createSubSection = async (req, res) => {
  try {
    //fecth data from Req body
    const { sectionId, title, timeDuration, description } = req.body;
    //extract file/video
    const video = req.files.videoFile;
    //validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    //create a sub-section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    //update section with this sub section ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    );
    // Populate the subSection field in the updated section
    const populatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // Log the updated section
    console.log("Updated Section:", populatedSection);
    //return response
    return res.status(200).json({
      succcess: true,
      message: "Sub Section Created Successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//HW: updateSubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;
    const video = req.files ? req.files.videoFile : null;

    //validation
    if (!subSectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields except video are required",
      });
    }

    let updatedData = {
      title: title,
      timeDuration: timeDuration,
      description: description,
    };

    if (video) {
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      updatedData.videoUrl = uploadDetails.secure_url;
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updatedData,
      { new: true }
    );

    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub Section updated successfully",
      updatedSubSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//HW:deleteSubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    //validation
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Sub Section ID and Section ID are required",
      });
    }

    // Find and delete the sub-section
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub Section not found",
      });
    }

    // Remove the sub-section reference from the section
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subSectionId },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sub Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
