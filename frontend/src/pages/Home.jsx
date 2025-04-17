import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button'; // Adjust path as needed
import Banner from "../assets/Images/banner.mp4"
const Home = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-8 bg-richblack-900 py-12'>
      {/* Main Heading Section */}
      <Link 
        to='/signup' 
        className='group mt-4 flex items-center gap-2 bg-richblack-800 hover:bg-richblack-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-[1.02]'
      >
        Become an Instructor
        <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
      </Link>
      <div className='text-center max-w-[1000px] flex flex-col gap-6'>
        <h1 className='text-4xl font-bold text-white'>
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </h1>
        
        <p className='text-richblack-300 text-lg leading-relaxed'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes,and personalized feedback from instructors.
        </p>
      </div>
      <div className="flex flex-row gap-7 mt-0">
    <CTAButton active={true} linkto={"./signup"}>
        Learn More
    </CTAButton>
    <CTAButton active={false} linkto={"./login"}>
        Book a Demo
    </CTAButton>
</div>
<div className="w-full max-w-[1000px] mx-auto shadow-lg shadow-blue-500 rounded-xl overflow-hidden">
  <video 
    muted 
    loop 
    autoPlay 
    className="w-full h-auto object-cover"
  >
    <source src={Banner} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

      {/* Become Instructor Button */}
      
    </div>
  );
};

export default Home;