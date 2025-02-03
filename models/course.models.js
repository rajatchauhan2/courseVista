const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],

  price: {
    type: Number,
  },
  thumbnail: {
    type: "String",
  },
  tag: {
    type: [String],
    require: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnrolled: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status:{
    type:String,
    enum:["Draft","Published"]
  }
});

module.exports = mongoose.model("Course", courseSchema);
