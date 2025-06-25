import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

const ReviewList = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/course/getReviews");
        const courseReviews = res.data.data.filter((r) => r.course._id === courseId);
        setReviews(courseReviews);
      } catch (err) {
        console.error("❌ Failed to load reviews", err);
      }
    };
    fetchReviews();
  }, [courseId]);

  if (!reviews.length) {
    return <p className="text-gray-400 mt-4">No reviews yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-bold text-white">Student Reviews</h2>
      {reviews.map((review) => (
        <div key={review._id} className="border border-space-light p-4 rounded bg-space-light/20">
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
            <span className="text-yellow-400">{review.rating}/5</span>
          </div>
          <p className="text-gray-300 italic">"{review.review}"</p>
          <p className="text-sm text-gray-500 mt-1">
            — {review.user.firstName} {review.user.lastName}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
