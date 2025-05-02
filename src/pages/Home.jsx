import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-white to-blue-50 px-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Empower Your Learning Journey
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Join a community of learners and instructors to grow your skills, collaborate, and achieve your career goals.
      </p>
      <div className="flex gap-4">
        <Link to="/signup">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
