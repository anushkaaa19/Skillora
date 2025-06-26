import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../redux/slices/cartSlice';
import { toast } from '../hooks/use-toast';
import ReviewList from "../components/ReviewList";
import { useAuthStore } from '../redux/slices/authSlice';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Star, Clock, Users, Award, Play, CheckCircle } from 'lucide-react';

import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CourseDetail = () => {
    const { user } = useAuthStore();
const isStudent = user?.accountType === "student";

  const { courseId } = useParams();
  const navigate = useNavigate();
  const { items, addToCart } = useCartStore();

  const [course, setCourse] = useState(null);
  const [totalDuration, setTotalDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const getAverageRating = () => {
    if (!course.ratingAndReviews || course.ratingAndReviews.length === 0) return 0;
    const total = course.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / course.ratingAndReviews.length;
  };
  

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.post(`http://localhost:4000/api/v1/course/getCourseDetails`, {
          courseId,
        });

        setCourse(res.data.data.courseDetails);
        setTotalDuration(res.data.data.totalDuration);
      } catch (err) {
        toast({
          title: 'Error loading course',
          description: err?.response?.data?.message || 'Failed to load course',
          variant: 'destructive',
        });
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  const handleAddToCart = () => {
    if (!course) return;
    const alreadyInCart = items.some((item) => item._id === course._id);
    if (alreadyInCart) {
      toast({
        title: 'Already in cart',
        description: 'This course is already in your cart',
      });
      return;
    }
    addToCart(course);
    toast({
      title: 'Added to cart',
      description: `${course.courseName} has been added to cart.`,
    });
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;
  if (!course) return null;

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={items.length} />

      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Side */}
          <div className="lg:col-span-2">
            <Button variant="ghost" onClick={() => navigate('/courses')} className="text-space-accent hover:text-white mb-4">
              ← Back to Courses
            </Button>

            <Badge className="mb-2 bg-space-accent/20 text-space-accent">
              {course?.category?.name || 'Uncategorized'}
            </Badge>

            <h1 className="text-3xl font-heading font-bold text-white mb-4">{course.courseName}</h1>

            <p className="text-gray-400 text-lg mb-4">{course.courseDescription}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                <span className="font-medium">{getAverageRating().toFixed(1)}</span>

              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.studentsEnrolled?.length || 0} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{totalDuration || 'Self-paced'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Certificate included</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Instructor</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-space-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {`${course?.instructor?.firstName?.[0] || ''}${course?.instructor?.lastName?.[0] || ''}`}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {`${course?.instructor?.firstName || ''} ${course?.instructor?.lastName || ''}`}
                  </p>
                  <p className="text-sm text-gray-400">Instructor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-1">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm sticky top-8">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img src={course.thumbnail} alt={course.courseName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30">
                    <Play className="h-8 w-8 text-white" fill="currentColor" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="text-2xl font-bold text-white mb-4">
                  ₹{Number(course.price).toFixed(2)}
                </div>
                {isStudent && (
  <Button
    className="w-full bg-space-accent hover:bg-space-secondary text-white"
    onClick={handleAddToCart}
  >
    Add to Cart
  </Button>
)}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-space-light/30 border border-space-light mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Curriculum
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{course.whatYouWillLearn}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.courseContent?.map((section, index) => (
                  <div key={section._id || index} className="border border-space-light rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">{section.sectionName}</h3>
                    <ul className="text-gray-400 text-sm space-y-1">
                      {section.subSection?.map((sub, i) => (
                        <li key={sub._id || i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span>{sub.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <ReviewList courseId={courseId} />

      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
