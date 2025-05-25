import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-space py-12 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-space-accent to-space-secondary flex items-center justify-center">
                <span className="font-heading text-white font-bold text-xl">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">Skillora</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering minds with stellar education. Begin your journey to the stars with our curated courses.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-space-accent transition">Courses</Link></li>
              <li><Link to="/study-room" className="hover:text-space-accent transition">Study Room</Link></li>
              <li><Link to="/leaderboard" className="hover:text-space-accent transition">Leaderboard</Link></li>
              <li><Link to="/doubts" className="hover:text-space-accent transition">Ask Doubts</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-space-accent transition">Log In</Link></li>
              <li><Link to="/signup" className="hover:text-space-accent transition">Sign Up</Link></li>
              <li><Link to="/dashboard" className="hover:text-space-accent transition">Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-space-accent transition">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-space-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@skillora.com</span>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-space-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-space-light mt-8 pt-8 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} Skillora. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-space-accent transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-space-accent transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
