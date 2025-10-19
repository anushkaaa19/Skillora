import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import ReviewSection from '../components/ReviewSection';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

  const token = JSON.parse(localStorage.getItem("auth-storage"))?.state?.user?.token;

  // Fetch full course details and completed videos
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/course/getFullCourseDetails`,
          { courseId },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const { courseDetails, completedVideos } = res.data.data;

        setCourseDetails(courseDetails || null);
        setCompletedVideos(completedVideos || []);

        // Set first video as default
        const firstSection = courseDetails?.courseContent?.[0];
        const firstVideo = firstSection?.subSection?.[0];
        if (firstVideo?.videoUrl) setCurrentVideo(firstVideo);
      } catch (err) {
        console.error("❌ Failed to fetch course:", err.response?.data || err);
      }
    };

    fetchCourse();
  }, [courseId, token]);

  // Mark video as completed
  const markVideoCompleted = async (subsectionId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/updateCourseProgress`,
        { courseId, subsectionId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setCompletedVideos((prev) => [...new Set([...prev, subsectionId])]);
    } catch (err) {
      console.error("❌ Failed to mark video completed:", err.response?.data || err);
    }
  };

  if (!courseDetails) return <div className="text-white p-8">🚀 Loading course...</div>;

  return (
    <div className="flex min-h-screen bg-space text-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-space-light bg-space-light/10 p-4 space-y-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-space-accent mb-2">Course Content</h2>
        {courseDetails.courseContent.map((section) => (
          <div key={section._id}>
            <h3 className="text-sm text-gray-300 font-bold mb-1">{section.sectionName}</h3>
            <ul className="space-y-1 ml-2">
              {section.subSection.map((sub) => (
                <li
                  key={sub._id}
                  onClick={() => setCurrentVideo(sub)}
                  className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-sm ${
                    currentVideo?._id === sub._id
                      ? "bg-space-accent/20 text-space-accent"
                      : "hover:bg-space-accent/10 text-gray-300"
                  }`}
                >
                  <span className="truncate">▶ {sub.title}</span>
                  {completedVideos.includes(sub._id) && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Video Player */}
      <div className="flex-1 p-6">
        {currentVideo ? (
          <div>
            <video
              src={currentVideo.videoUrl}
              controls
              autoPlay
              className="w-full max-h-[70vh] rounded-lg mb-4 border border-space-light"
              onError={() =>
                console.error("🚫 Video failed to load:", currentVideo.videoUrl)
              }
            />
            <h2 className="text-xl font-bold text-white mb-2">{currentVideo.title}</h2>
            <p className="text-gray-400 mb-4">{currentVideo.description}</p>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => markVideoCompleted(currentVideo._id)}
              disabled={completedVideos.includes(currentVideo._id)}
            >
              {completedVideos.includes(currentVideo._id)
                ? "✅ Completed"
                : "Mark as Completed"}
            </Button>
          </div>
        ) : (
          <div className="text-gray-400">📽 Select a video to start learning</div>
        )}
      </div>

      {/* Reviews */}
      <ReviewSection courseId={courseId} />
    </div>
  );
};

export default CoursePlayer;
