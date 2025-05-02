import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    toast.success("Logged In");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Image Section */}
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1584697964192-3b9f31b1b468"
            alt="Login Visual"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={submitHandler} className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Sign in to your account to continue</p>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email Address <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              placeholder="Enter Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700">
              Password <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Enter Password"
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-[48px] right-4 cursor-pointer text-xl text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
