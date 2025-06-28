const Course = require('../models/course');
const User = require('../models/user');
const Category = require('../models/category');
const Section = require('../models/section')
const SubSection = require('../models/subSection')
const CourseProgress = require('../models/courseProgress')

const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration")



// ================ create new course ================
exports.createCourse = async (req, res) => {
    try {
        // extract data
        let { courseName, courseDescription, whatYouWillLearn, price, category, instructions: _instructions, status, tag: _tag } = req.body;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        // console.log("tag = ", tag)
        // console.log("instructions = ", instructions)

        // get thumbnail of course
        const thumbnail = req.files?.thumbnailImage;

        // validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price
            || !category || !thumbnail || !instructions.length || !tag.length) {
            return res.status(400).json({
                success: false,
                message: 'All Fileds are required'
            });
        }

        if (!status || status === undefined) {
            status = "Draft";
        }

        // check current user is instructor or not , bcoz only instructor can create 
        // we have insert user id in req.user , (payload , while auth ) 
        const instructorId = req.user.id;


        // check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(401).json({
                success: false,
                message: 'Category Details not found'
            })
        }


        // upload thumbnail to cloudinary
        const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create new course - entry in DB
        const newCourse = await Course.create({
            courseName, courseDescription, instructor: instructorId, whatYouWillLearn, price, category: categoryDetails._id,
            tag, status, instructions, thumbnail: thumbnailDetails.secure_url, createdAt: Date.now(),
        });

        // add course id to instructor courses list, this is bcoz - it will show all created courses by instructor 
        await User.findByIdAndUpdate(instructorId,
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        );


        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // return response
        res.status(200).json({
            success: true,
            data: newCourse,
            message: 'New Course created successfully'
        })
    }

    catch (error) {
        console.log('Error while creating new course');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating new course'
        })
    }
}

exports.getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional: Filter by category or instructor if needed
    const category = req.query.category;
    const instructor = req.query.instructor;

    const query = {};

    if (category) query.category = category;
    if (instructor) query.instructor = instructor;

    const allCourses = await Course.find(query, {
      courseName: true,
      courseDescription: true,
      price: true,
      thumbnail: true,
      instructor: true,
      ratingAndReviews: true,
      studentsEnrolled: true,
      category: true,
      createdAt: true,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "instructor",
        select: "firstName lastName email image",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "ratingAndReviews",
        select: "rating",
      });

    // Total count (for frontend pagination UI)
    const totalCourses = await Course.countDocuments(query);

    const coursesWithRatings = allCourses.map((course) => {
      const reviews = course.ratingAndReviews;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
          : 0;

      return {
        ...course.toObject(),
        rating: Number(avgRating.toFixed(1)),
      };
    });

    return res.status(200).json({
      success: true,
      data: coursesWithRatings,
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// ================ Get Course Details ================
exports.getCourseDetails = async (req, res) => {
    try {
      // get course ID
      const { courseId } = req.body;
  
      // find course details
      const courseDetails = await Course.findOne({ _id: courseId })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "-videoUrl",
          },
        })
        .exec();
  
      // validation
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find the course with ID: ${courseId}`,
        });
      }
  
      // Calculate total duration
      let totalDurationInSeconds = 0;
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration);
          totalDurationInSeconds += timeDurationInSeconds;
        });
      });
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
  
      // Calculate average rating
      const reviews = courseDetails.ratingAndReviews;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0;
  
      // Return response
      return res.status(200).json({
        success: true,
        message: "Fetched course data successfully",
        data: {
          courseDetails,
          totalDuration,
          avgRating: Number(avgRating.toFixed(1)),
        },
      });
    } catch (error) {
      console.log("Error while fetching course details");
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching course details",
        error: error.message,
      });
    }
  };
  // courseController.js
exports.markVideoCompleted = async (req, res) => {
    try {
      const { videoId, courseId } = req.body;
      const userId = req.user.id;
  
      let courseProgress = await CourseProgress.findOne({ courseID: courseId, userId });
  
      if (!courseProgress) {
        courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId,
          completedVideos: [videoId],
        });
      } else if (!courseProgress.completedVideos.includes(videoId)) {
        courseProgress.completedVideos.push(videoId);
        await courseProgress.save();
      }
  
      res.status(200).json({ success: true, message: "Video marked as completed" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update progress" });
    }
  };
  
// ================ Get Full Course Details ================
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        // console.log('courseId userId  = ', courseId, " == ", userId)

        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate({
                path: "ratingAndReviews",
                populate: {
                  path: "user",
                  select: "firstName lastName",
                }
              })
                          .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        //   console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        //   count total time duration of course
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeStr = subSection.timeDuration || "0";
                const seconds = isNaN(parseInt(timeStr)) ? 0 : parseInt(timeStr);
                totalDurationInSeconds += seconds;
              });
              
        })
        console.log(JSON.stringify(courseDetails.courseContent, null, 2));

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



// ================ Edit Course Details ================
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            // console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        // updatedAt
        course.updatedAt = Date.now();

        //   save data
        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        // success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Error while updating course",
            error: error.message,
        })
    }
}



// ================ Get a list of Course for a given Instructor ================
exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })


        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
            // totalDurationInSeconds:totalDurationInSeconds,
            message: 'Courses made by Instructor fetched successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}



// ================ Delete the Course ================
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // delete course thumbnail From Cloudinary
        await deleteResourceFromCloudinary(course?.thumbnail);

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    const subSection = await SubSection.findById(subSectionId)
                    if (subSection) {
                        await deleteResourceFromCloudinary(subSection.videoUrl) // delete course videos From Cloudinary
                    }
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error while Deleting course",
            error: error.message,
        })
    }
}



