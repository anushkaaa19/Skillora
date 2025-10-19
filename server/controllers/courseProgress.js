const mongoose = require("mongoose")
const Section = require("../models/section")
const SubSection = require("../models/subSection")
const CourseProgress = require("../models/courseProgress")
const User = require("../models/user")
const Course = require("../models/course")

// ================ update Course Progress ================
// updateCourseProgress
exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) return res.status(404).json({ error: "Invalid subsection" });

    let courseProgress = await CourseProgress.findOne({ courseID: courseId, userId });

    if (!courseProgress) {
      // Auto-create progress if not exists
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId,
        completedVideos: [subsectionId],
      });
    } else if (!courseProgress.completedVideos.includes(subsectionId)) {
      courseProgress.completedVideos.push(subsectionId);
      await courseProgress.save();
    }

    return res.status(200).json({ message: "Course progress updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// createRating


exports.getAllCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Fetch all progress records for the logged-in user
    const progressRecords = await CourseProgress.find({ userId });

    console.log("📘 Found progress records:", progressRecords.length);

    if (progressRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No progress found for this user.",
        data: {},
      });
    }

    // 2️⃣ Create a progress object keyed by courseId (to match frontend expectation)
    const progressData = {};

    for (const record of progressRecords) {
      try {
        // Fetch the corresponding course with populated sections and subsections
        const course = await Course.findById(record.courseID)
          .populate({
            path: 'courseContent',
            populate: {
              path: 'subSection'
            }
          });

        if (!course) {
          console.warn(`⚠️ Skipping: Course not found for ID ${record.courseID}`);
          progressData[record.courseID] = 0;
          continue;
        }

        // Calculate total subsections (videos) in the course
        let totalSubsections = 0;
        if (course.courseContent && Array.isArray(course.courseContent)) {
          course.courseContent.forEach(section => {
            if (section.subSection && Array.isArray(section.subSection)) {
              totalSubsections += section.subSection.length;
            }
          });
        }

        // Use completedVideos instead of completedSections
        const completed = record?.completedVideos?.length || 0;
        
        // Calculate progress percentage based on subsections (videos)
        const progressPercent = totalSubsections > 0 
          ? Math.round((completed / totalSubsections) * 100) 
          : 0;

        // Add to progress object with courseId as key
        progressData[record.courseID] = progressPercent;
      } catch (courseError) {
        console.error(`❌ Error processing course ${record.courseID}:`, courseError);
        progressData[record.courseID] = 0;
      }
    }

    // 3️⃣ Respond with progress data as object
    return res.status(200).json({
      success: true,
      message: "Fetched student course progress successfully",
      data: progressData,
    });
  } catch (error) {
    console.error("❌ Error fetching course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching progress",
      error: error.message,
    });
  }
};