import React from 'react';
import { FaGraduationCap } from 'react-icons/fa6';
import { PiSealCheckFill } from 'react-icons/pi';
import { GiCutDiamond } from 'react-icons/gi';
import { LuFileCode2 } from 'react-icons/lu';
import timelineImage from '../../../assets/Images/TimelineImage.png'

const timeline = [
  {
    icon: <PiSealCheckFill size={28} className="text-[#008DCE]" />,
    title: "Leadership",
    description: "Fully committed to the success company"
  },
  {
    icon: <FaGraduationCap size={28} className="text-[#F72585]" />,
    title: "Responsibility",
    description: "Employees will always be our top priority"
  },
  {
    icon: <GiCutDiamond size={28} className="text-[#14B8A6]" />,
    title: "Flexibility",
    description: "The ability to switch is an important skill"
  },
  {
    icon: <LuFileCode2 size={28} className="text-[#FACC15]" />,
    title: "Solve the problem",
    description: "Code against the actual problem"
  },
];

const TimelineSection = () => {
  return (
    <div className='flex flex-col lg:flex-row items-start justify-between mt-14 gap-12 max-w-[1280px] mx-auto px-6'>
      {/* Left: Timeline List */}
      <div className='flex flex-col gap-8 flex-[0.5] w-full mt-20'>
        {timeline.map((element, index) => (
          <div key={index} className='flex gap-4 items-start w-full'>
            <div>{element.icon}</div>
            <div className='flex flex-col'>
              <h3 className='text-lg font-semibold'>{element.title}</h3>
              <p className='text-base max-w-[400px] leading-normal'>
                {element.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Image */}
      <div className='flex justify-center items-center flex-[0.5] w-full'>
        <img
          src={timelineImage}
          alt="Illustration"
          className='w-[500px] max-w-full object-contain'
        />
       
   
      </div>
    </div>
  );
};

export default TimelineSection;
