import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const HomeSection = () => {
  return (
    <div>
      {/* Section 1 - Become an Instructor */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">
        <Link to="/signup" className="flex items-center gap-2 group">
          <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <p className="font-medium text-blue-800">Become an Instructor</p>
          </div>
          <FaArrowRight className="text-blue-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Section 2 - Add your second section content here */}
    </div>
  );
};

export default HomeSection;