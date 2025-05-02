import React, { useState } from 'react';
import SignupForm from "./SignUpForm";
import LoginForm from './LoginForm';
import { authService } from '../services/api';
import img from "../assets/logo.png";
import { auth, provider, signInWithPopup } from "../firebase";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Template = ({ title, desc1, desc2, image, formType, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Clear existing auth state
      localStorage.clear();
      sessionStorage.clear();

      // Step 1: Firebase authentication
      const result = await signInWithPopup(auth, provider);
      console.log("Firebase authentication successful:", result.user);
      
      // Step 2: Get ID token
      const idToken = await result.user.getIdToken(true);
      console.log("Obtained Firebase ID token");

      // Step 3: Verify with backend
      const response = await authService.googleLogin(idToken);

      // Step 4: Handle successful login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.user.email,
        name: response.data.user.name,
        image: response.data.user.image
      }));
      
      setIsLoggedIn(true);
      navigate("/dashboard", { replace: true });
      toast.success("Logged in successfully!");

    } catch (error) {
      console.error("Authentication error:", {
        error: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      let errorMessage = "Google Sign-In Failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes("auth/popup-closed-by-user")) {
        errorMessage = "Sign-in popup was closed";
      }
      
      toast.error(errorMessage);
      
      // Ensure clean state on failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8">
        
        {/* Left: Form Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">
            <span>{desc1}</span>
            <br />
            <span className="text-blue-600 font-medium">{desc2}</span>
          </p>

          {/* Form Switcher */}
          {formType === "signup" ? (
            <SignupForm setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`mt-4 py-2 px-4 border border-gray-300 rounded-md bg-white flex items-center justify-center gap-3 hover:bg-gray-100 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Sign in with Google"
          >
            {isLoading ? (
              <span className="text-gray-700">Signing in...</span>
            ) : (
              <>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5"
                  loading="lazy"
                />
                <span className="text-gray-700 font-medium">
                  Sign in with Google
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right: Image Section */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src={image || img}
            alt="App branding"
            className="w-full max-w-sm object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Template;