import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "../components/ui/card";
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from "../hooks/use-toast";
import { useAuthStore } from '../redux/slices/authSlice';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const otpRef = useRef();
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  const handleSendOTP = async () => {
    if (!email) {
      return toast({
        title: "Missing Email",
        description: "Please enter your email before requesting an OTP.",
        variant: "destructive",
      });
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/auth/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Failed to send OTP",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code.",
        });
        otpRef.current?.focus();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send OTP. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          contactNumber,
          otp,
          accountType: role === "student" ? "Student" : "Instructor",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Signup Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup Successful",
          description: `Welcome to Skillora, ${firstName}!`,
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
  
    try {
  
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
  
      
      const roleToSend =
        role?.toLowerCase() === "instructor" ? "Instructor" : "student";
  
  
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/auth/google-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          accountType: roleToSend,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("❌ Backend error response:", data);
        throw new Error(data.message || "Google login failed");
      }
  
      loginSuccess(data.user);
  
      toast({
        title: "Google signup successful",
        description: `Welcome to Skillora, ${data.user.firstName}!`,
      });
  
      navigate(roleToSend === "Instructor" ? "/instructor/dashboard" : "/student/dashboard");
    } catch (err) {
      console.error("🔥 Google Sign-In failed:", err.message);
      toast({
        title: "Google signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    // 🚀 Your full UI remains untouched
    // 👇 This returns the same JSX you provided — full card, form, design
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md relative">
          <div className="absolute top-[-50px] right-[-30px] w-20 h-20 rounded-full bg-space-accent/20 filter blur-xl" />
          <div className="absolute bottom-[-30px] left-[-20px] w-16 h-16 rounded-full bg-space-secondary/30 filter blur-xl" />
          <Card className="border-space-light bg-space-light/40 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">Create an account</CardTitle>
              <CardDescription className="text-center">Enter your information to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-space-light/50 border-space-light text-white"
                    />
                  </div>
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-space-light/50 border-space-light text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-space-light/50 border-space-light text-white flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleSendOTP}
                      className="bg-space-accent hover:bg-space-secondary"
                      disabled={!email || isLoading}
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="text"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="bg-space-light/50 border-space-light text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-space-light/50 border-space-light text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-space-light/50 border-space-light text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    required
                    value={otp}
                    ref={otpRef}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-space-light/50 border-space-light text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup value={role} onValueChange={(val) => setRole(val)} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="text-gray-300">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Instructor" id="Instructor" />
                      <Label htmlFor="Instructor" className="text-gray-300">Instructor</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="text-xs text-gray-400">
                  By clicking Sign Up, you agree to our{" "}
                  <Link to="/terms" className="text-space-accent hover:underline">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="text-space-accent hover:underline">Privacy Policy</Link>.
                </div>

                <Button type="submit" className="w-full bg-space-accent hover:bg-space-secondary" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-space-light"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-space px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="border-space-light text-white hover:bg-space-light"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
                    </svg>
                    Sign up with Google
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-space-accent hover:underline">Sign in</Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
