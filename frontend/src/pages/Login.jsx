import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from "../hooks/use-toast";
import { useAppDispatch } from '../redux/hooks';
import { loginSuccess } from '../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      console.log('Login attempt with:', { email, password });
      
      // Simulate successful login
      // In a real application, you would validate credentials against a backend
      const role = email.includes('instructor') ? 'instructor' : 'student';
      
      // Dispatch login success action
      dispatch(loginSuccess({
        id: '123',
        name: email.split('@')[0],
        email,
        role,
      }));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${email.split('@')[0]}!`,
      });
      
      // Redirect based on role
      if (role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    // Simulate Google sign-in process
    setTimeout(() => {
      // Simulate successful login with Google
      const role = Math.random() > 0.5 ? 'instructor' : 'student';
      const randomName = `user${Math.floor(Math.random() * 1000)}`;
      
      dispatch(loginSuccess({
        id: `google-${Date.now()}`,
        name: randomName,
        email: `${randomName}@gmail.com`,
        role,
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + randomName,
      }));
      
      toast({
        title: "Google login successful",
        description: `Welcome, ${randomName}!`,
      });
      
      // Redirect based on role
      if (role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md relative">
          {/* Decorative elements */}
          <div className="absolute top-[-50px] right-[-30px] w-20 h-20 rounded-full bg-space-accent/20 filter blur-xl"></div>
          <div className="absolute bottom-[-30px] left-[-20px] w-16 h-16 rounded-full bg-space-secondary/30 filter blur-xl"></div>
          
          <Card className="border-space-light bg-space-light/40 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-space-light/50 border-space-light text-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-space-accent hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-space-light/50 border-space-light text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-space-accent hover:bg-space-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
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
                      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                    </svg>
                    Sign in with Google
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-space-accent hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
