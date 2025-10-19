import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from "../hooks/use-toast";
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuthStore } from '../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { loginStart, loginSuccess, loginFail, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginStart();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);

      const userRole = (data.user.role || data.user.accountType || "").toLowerCase();

      loginSuccess({
        user: { ...data.user, role: userRole },
        token: data.token
      });

      console.log("🚀 Auth store after manual login:", useAuthStore.getState());

      toast({
        title: "Login successful",
        description: `Welcome ${data.user.firstName || data.user.name}`,
      });

      navigate(userRole === "instructor" ? "/instructor/dashboard" : "/student/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
      loginFail();
    }
  };

  const handleGoogleSignIn = async () => {
    loginStart();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/auth/google-login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);

      const userRole = (data.user.role || data.user.accountType || "").toLowerCase();

      loginSuccess({
        user: { ...data.user, role: userRole },
        token: data.token
      });

      console.log("🚀 Auth store after Google login:", useAuthStore.getState());

      toast({
        title: "Google login successful",
        description: `Welcome ${data.user.firstName || data.user.name}`,
      });

      navigate(userRole === "instructor" ? "/instructor/dashboard" : "/student/dashboard");
    } catch (err) {
      toast({
        title: "Google login failed",
        description: err.message,
        variant: "destructive",
      });
      loginFail();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md relative">
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
                  <label htmlFor="remember" className="text-sm font-medium leading-none text-gray-300">
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

              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="border-space-light text-white hover:bg-space-light"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Sign in with Google
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 text-center text-sm text-gray-400">
              Don't have an account? <Link to="/signup" className="text-space-accent hover:underline">Sign up</Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
