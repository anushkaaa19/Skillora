const mongoose = require("mongoose")
const Section = require("../models/section")
const SubSection = require("../models/subSection")
const CourseProgress = require("../models/courseProgress")
const User =require("../models/user")


// ================ update Course Progress ================
exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  }
  catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}



// GET progress for all enrolled courses
exports.getAllCourseProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'courseProgress',
        populate: {
          path: 'courseID',
          populate: {
            path: 'courseContent',
            populate: {
              path: 'subSection',
            },
          },
        },
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = {};

    for (const progress of user.courseProgress) {
      const course = progress.courseID;

      // 🟨 Add these logs:
      console.log("Course:", course.courseName);
      console.log("Total CourseContent:", course.courseContent?.length);
      console.log("Subsections in each section:");
      course.courseContent?.forEach((sec, i) => {
        console.log(`  Section ${i + 1}: ${sec.subSection?.length || 0} subsections`);
      });

      const totalLectures = course.courseContent.reduce((acc, sec) => {
        return acc + (sec.subSection?.length || 0);
      }, 0);

      const completed = progress.completedVideos.length;

      console.log("Total Lectures:", totalLectures);
      console.log("Completed:", completed);

      const percentage = totalLectures === 0 ? 0 : Math.round((completed / totalLectures) * 100);
      result[course._id] = percentage;
    }

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
