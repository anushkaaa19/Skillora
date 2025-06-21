// pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/reset-password-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      toast({ title: "Email sent!", description: data.message });
        // ✅ Redirect after toast
        setTimeout(() => {
            navigate("/check-email");
          }, 1000);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-space px-4">
      <form onSubmit={handleReset} className="space-y-4 bg-space-light/40 p-6 rounded-lg backdrop-blur-md w-full max-w-md border border-space-light">
        <h2 className="text-2xl font-semibold text-white text-center">Forgot Password</h2>
        <p className="text-gray-400 text-sm text-center">Enter your registered email</p>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            className="bg-space-light/50 border-space-light text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-space-accent hover:bg-space-secondary"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
