import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const FeaturedCourses = ({ courses = [], onAddToCart }) => {
  // Optional: Pick top 4 rated courses


  const topCourses = [...courses]
    .filter(course => Number(course.rating) >= 2)
    .slice(0, 4);
    console.log("📦 All received courses:", courses);
    console.log("✅ Filtered top courses (rating >= 2):", topCourses);

  return (
    <div className="py-20 container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Featured Courses</h2>
          <p className="text-gray-400 max-w-2xl">
            Expand your knowledge with our most popular courses. Learn at your own pace and earn certificates.
          </p>
        </div>
        <Link to="/courses" className="mt-4 md:mt-0">
          <Button variant="outline" className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
            View All Courses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topCourses.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No featured courses available</p>
        ) : (
          topCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard course={course} onAddToCart={onAddToCart} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedCourses;
