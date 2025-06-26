import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../redux/slices/authSlice'; // ✅ Zustand

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand hydration to finish before accessing store data
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // If already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsub;
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      if (user.role === 'Instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [user, isHydrated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />

      <main className="flex-grow container mx-auto py-12 px-4 md:px-6 flex items-center justify-center">
        <Card className="border-space-light bg-space-light/30 backdrop-blur-sm w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-space-accent border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-xl text-white mb-2">Redirecting to dashboard...</h2>
            <p className="text-gray-400 mb-6">
              Please wait while we redirect you to the appropriate dashboard.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white"
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
              <Button
                className="bg-space-accent text-white hover:bg-space-secondary"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
