const User = require('../models/user')
const Course = require('../models/course')
const RatingAndReview = require('../models/ratingAndReview')
const mongoose = require('mongoose');

exports.createRating = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    if (!rating || !review || !courseId) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const courseDetails = await Course.findOne({ _id: courseId, studentsEnrolled: userId });
    if (!courseDetails) return res.status(404).json({ success: false, message: 'Student not enrolled' });

    const alreadyReviewed = await RatingAndReview.findOne({ course: courseId, user: userId });
    if (alreadyReviewed) return res.status(403).json({ success: false, message: 'Already reviewed' });

    const ratingReview = await RatingAndReview.create({ user: userId, course: courseId, rating, review });

    await Course.findByIdAndUpdate(courseId, { $push: { ratingAndReviews: ratingReview._id } });

    return res.status(200).json({ success: true, data: ratingReview, message: "Review created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// getAllRatingReview
exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .populate({ path: 'user', select: 'firstName lastName email image' })
      .populate({ path: 'course', select: '_id courseName' })
      .exec();

    return res.status(200).json({ success: true, data: allReviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




// ================ Get Average Rating ================
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

