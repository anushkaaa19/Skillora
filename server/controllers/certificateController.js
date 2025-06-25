// controllers/certificateController.js
const Certificate = require('../models/Certificate');
const { generateCertificate } = require('../utils/generateCertificate');
const User = require('../models/user');
const Course = require('../models/course');

exports.issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log("🔹 Attempting to issue certificate");
    console.log("➡️ userId:", userId);
    console.log("➡️ courseId:", courseId);

    const existing = await Certificate.findOne({ student: userId, course: courseId });
    if (existing) {
      console.warn("⚠️ Certificate already issued");
      return res.status(400).json({ message: 'Certificate already issued' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    const course = await Course.findById(courseId).populate('instructor');
    if (!course) {
      console.error("❌ Course not found");
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.instructor) {
      console.error("❌ Instructor not populated");
      return res.status(500).json({ message: 'Course instructor data missing' });
    }

    console.log("✅ Data verified. Generating certificate...");

    const certificateUrl = await generateCertificate({
      studentName: `${user.firstName} ${user.lastName}`,
      courseName: course.courseName,
      instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
    });

    console.log("✅ Certificate URL:", certificateUrl);

    const certificate = await Certificate.create({
      student: userId,
      course: courseId,
      certificateUrl,
    });

    console.log("✅ Certificate record created");

    res.status(200).json({ success: true, data: certificate });

  } catch (err) {
    console.error("❌ Error issuing certificate:", err);
    res.status(500).json({ message: 'Failed to issue certificate' });
  }
};
// In certificateController.js
// controllers/certificateController.js
exports.getUserCertificates = async (req, res) => {
    try {
      const userId = req.user.id;
      const certificates = await Certificate.find({ student: userId })
        .populate({
          path: 'course',
          populate: {
            path: 'instructor',
            model: 'User'
          }
        });
  
      res.status(200).json({ success: true, data: certificates });
    } catch (err) {
      console.error("Error fetching certificates:", err);
      res.status(500).json({ message: "Failed to fetch certificates" });
    }
  };
  