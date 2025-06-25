// components/ReviewSection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { useAuthStore } from '../redux/slices/authSlice';
import { toast } from '../hooks/use-toast';

const ReviewSection = ({ courseId }) => {
  const { user } = useAuthStore();
  const token = user?.token;

  const [allReviews, setAllReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/course/getReviews');
      const courseReviews = res.data.data.filter((r) => r.course._id === courseId);
      setAllReviews(courseReviews);

      const isReviewed = courseReviews.find((r) => r.user._id === user?._id);
      setAlreadyReviewed(!!isReviewed);
    } catch (err) {
      console.error("❌ Can't fetch reviews", err);
    }
  };

  const submitReview = async () => {
    try {
      setLoading(true);
      await axios.post(
        'http://localhost:4000/api/v1/course/createRating',
        { courseId, rating, review },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast({ title: '✅ Review submitted' });
      setReview('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast({
        title: 'Error submitting review',
        description: err?.response?.data?.message || 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  return (
    <div className="mt-8 p-6 border border-space-light bg-space-light/20 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white">Course Reviews</h2>

      {/* Show form only if not already reviewed */}
      {!alreadyReviewed && (
        <div className="space-y-2">
          <p className="text-white font-medium">Leave your review:</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-5 w-5 cursor-pointer ${
                  n <= rating ? 'text-yellow-400' : 'text-gray-500'
                }`}
                fill={n <= rating ? 'currentColor' : 'none'}
                onClick={() => setRating(n)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 rounded bg-space-light/30 text-white border border-space-light"
            rows={3}
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <Button onClick={submitReview} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}

      {/* All reviews */}
      <div className="space-y-4 mt-6">
        {allReviews.map((r) => (
          <div key={r._id} className="p-4 bg-space-light/30 rounded border border-space-light">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">
                {r.user.firstName} {r.user.lastName}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                    fill={i < r.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-300 mt-2">{r.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
