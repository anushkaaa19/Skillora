import React from 'react';
import { FaRocket } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-4 text-blue-600 text-4xl">
          <FaRocket />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard!</h1>
        <p className="text-gray-600">
          We're glad to have you here. Start exploring your courses, track your progress,
          or join a study room to collaborate in real-time.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
