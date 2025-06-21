// pages/CheckEmailPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CheckEmailPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-space px-4 text-white text-center">
    <div className="bg-space-light/40 p-8 rounded-lg backdrop-blur-md border border-space-light max-w-md w-full">
      <h2 className="text-2xl font-semibold">Check your email</h2>
      <p className="mt-2 text-gray-300">
        We’ve sent a password reset link to your email address. Please check your inbox and follow the instructions.
      </p>
      <Link to="/login" className="mt-4 inline-block text-space-accent hover:underline">
        Back to Login
      </Link>
    </div>
  </div>
);

export default CheckEmailPage;
