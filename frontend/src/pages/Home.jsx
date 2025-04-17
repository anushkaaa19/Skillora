import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";

const Home = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-8 bg-richblack-900 py-12'>

      {/* Become Instructor Button */}
      <Link 
        to='/signup' 
        className='group mt-4 flex items-center gap-2 bg-richblack-800 hover:bg-richblack-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-[1.02]'
      >
        Become an Instructor
        <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
      </Link>

      {/* Hero Section */}
      <div className='text-center max-w-[1000px] flex flex-col gap-6 px-4'>
        <h1 className='text-4xl font-bold text-white'>
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </h1>
        <p className='text-richblack-300 text-lg leading-relaxed'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-row gap-6 mt-0">
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>
        <CTAButton active={false} linkto={"/login"}>
          Book a Demo
        </CTAButton>
      </div>

      {/* Video Banner */}
      <div className="w-full max-w-[1200px] mx-auto shadow-lg rounded-xl overflow-hidden px-4">
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

      {/* Animated Code Blocks */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        
        {/* Code block 1 */}
        <div className=''>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className='text-3xl lg:text-4xl font-semibold'>
                Unlock Your
                <HighlightText text={"coding potential "} />
                with our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</a><a href="three/">Three</a>\n</nav>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={"code-block1-grad"}
          />
        </div>

        {/* Code block 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-3xl lg:text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup", // corrected the link path
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/signup", // corrected the link path
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={"code-block2-grad"}
          />
        </div>
      
      </div>
    </div>
  );
};

export default Home;
