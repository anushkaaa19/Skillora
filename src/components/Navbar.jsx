import React from 'react';
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Skillora Logo"
            className="h-12 w-auto object-contain"
            loading="lazy"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium text-sm lg:text-base">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </nav>

        {/* Buttons */}
        <div className="flex gap-3 items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <button className="px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  toast.success("Logged Out");
                }}
                className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
