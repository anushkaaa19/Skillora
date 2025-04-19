import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import Footer from '../components/common/Footer';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from "../components/core/HomePage/ExploreMore"
import Review from "../components/core/HomePage/Reviews"

const Home = () => {
    return (
    <div className="flex flex-col min-h-screen w-screen bg-richblack-900 m-0 p-0">

<div className='flex-1 w-full flex flex-col items-center gap-8 py-12 mx-auto'>

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
                <ExploreMore/>

            </div>
            {/* Section 2 */}
            <div className="bg-white w-[100%] text-richblack-700 flex flex-col items-center">
                <div className="h-[310px]">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">

                        <div className="h-[150px]"></div>

                        <div className="flex flex-row gap-7 text-white">
                            {/* Explore Full Catalog Button */}
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex items-center gap-3">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>

                            {/* Learn More Button */}
                            <CTAButton active={false} linkto={"/signup"}>
                                <div>
                                    Learn more
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>
                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the Skills you need for a
                            <HighlightText text={'Job that is in demand'} />
                        </div>

                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyMotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>

                            <CTAButton active={true} linkto="/signup">
                                <div>
                                    Learn more
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>
                <TimelineSection />
                <LearningLanguageSection />


            </div>
            {/* Section 3 */}
            <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
                <InstructorSection />
                <Review/>
            </div>
            </div>
            <Footer className="w-full bg-richblack-800 text-white py-8"/>




        </div>
    );
};

export default Home;
