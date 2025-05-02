import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const SignupForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [accountType,setAccountType]=useState("student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 

  const submitHandler = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoggedIn(true);
    toast.success("Account Created");
    console.log(formData);
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Role Selector */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setAccountType("student")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            accountType === "student"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setAccountType("instructor")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            accountType === "instructor"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Instructor
        </button>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name <sup className="text-red-500">*</sup>
          </label>
          <input
            required
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={changeHandler}
            placeholder="Enter First Name"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name <sup className="text-red-500">*</sup>
          </label>
          <input
            required
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={changeHandler}
            placeholder="Enter Last Name"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address <sup className="text-red-500">*</sup>
          </label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Enter Email Address"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Create Password <sup className="text-red-500">*</sup>
          </label>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Enter Password"
            className="mt-1 w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-xl cursor-pointer text-gray-500"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password <sup className="text-red-500">*</sup>
          </label>
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={changeHandler}
            placeholder="Confirm Password"
            className="mt-1 w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-xl cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
