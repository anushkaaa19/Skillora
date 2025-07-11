const Section = require('../models/section');
const SubSection = require('../models/subSection');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const CourseProgress = require('../models/courseProgress');


exports.getLearningHours = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("➡️ Fetching progress for user:", userId);
  
      const allProgress = await CourseProgress.find({ userId });
      console.log("📘 CourseProgress records:", JSON.stringify(allProgress, null, 2));
  
      const allCompletedVideoIds = allProgress.flatMap(cp => cp.completedVideos);
      console.log("🎥 All completed video IDs:", allCompletedVideoIds);
  
      if (allCompletedVideoIds.length === 0) {
        console.log("⚠️ No completed videos found.");
        return res.status(200).json({ success: true, data: 0 });
      }
  
      const subSections = await SubSection.find({
        _id: { $in: allCompletedVideoIds },
      });
      console.log("📦 Fetched SubSections:", JSON.stringify(subSections, null, 2));
  
      let totalMinutes = 0;
  
      for (const sub of subSections) {
        const raw = sub.timeDuration;
        const minutes = parseFloat(raw);
  
        console.log(`🧮 SubSection "${sub.title}" - timeDuration: "${raw}" -> parsed: ${minutes}`);
  
        if (!isNaN(minutes)) {
          totalMinutes += minutes;
        } else {
          console.log(`❌ Failed to parse timeDuration for SubSection ID: ${sub._id}`);
        }
      }
  
      const totalHours = (totalMinutes / 60).toFixed(2);
      console.log(`✅ Total minutes: ${totalMinutes}, Total hours: ${totalHours}`);
  
      return res.status(200).json({ success: true, data: Number(totalHours) });
  
    } catch (err) {
      console.error("❌ Error calculating learning hours:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
// ================ create SubSection ================
exports.createSubSection = async (req, res) => {
    try {
        // extract data
        const { title, description, sectionId } = req.body;

        // extract video file
        const videoFile = req.files.video
        // console.log('videoFile ', videoFile)

        // validation
        if (!title || !description || !videoFile || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // upload video to cloudinary
        const videoFileDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);

        // create entry in DB
        const SubSectionDetails = await SubSection.create(
            { title, timeDuration: videoFileDetails.duration, description, videoUrl: videoFileDetails.secure_url })

        // link subsection id to section
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection")

        // return response
        res.status(200).json({
            success: true,
            data: updatedSection,
            message: 'SubSection created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating SubSection');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating SubSection'
        })
    }
}



// ================ Update SubSection ================
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;

        // validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'subSection ID is required to update'
            });
        }

        // find in DB
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        // add data
        if (title) {
            subSection.title = title;
        }

        if (description) {
            subSection.description = description;
        }

        // upload video to cloudinary
        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = uploadDetails.duration;
        }

        // save data to DB
        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    }
    catch (error) {
        console.error('Error while updating the section')
        console.error(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating the section",
        })
    }
}



// ================ Delete SubSection ================
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )

        // delete from DB
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId).populate('subSection')

        // In frontned we have to take care - when subsection is deleted we are sending ,
        // only section data not full course details as we do in others 

        // success response
        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,

            error: error.message,
            message: "An error occurred while deleting the SubSection",
        })
    }
}