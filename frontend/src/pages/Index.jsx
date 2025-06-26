import React, { useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';
import HeroSection from '../components/HeroSection';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturedCourses from '../components/FeaturedCourses';
import LeaderboardSection from '../components/LeaderboardSection';
import FeatureSection from '../components/FeatureSection';
import { useAuthStore } from '../redux/slices/authSlice';
import { useCourseStore } from '../redux/slices/courseSlice';


const Index = () => {
  const [cartItems, setCartItems] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  
  const { isAuthenticated } = useAuthStore();
  const getCourses = useCourseStore((state) => state.getCourses);
  useEffect(() => {
    getCourses(); // ✅ Fetch courses on mount
  }, []);
 
  
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/course/getAllCourses`);
        const json = await res.json();
        if (json.success) {
          const topRated = json.data
            .filter(course => course.rating >= 2)
            .slice(0, 4);
          setFeaturedCourses(topRated);
        } else {
          toast({ title: "Error", description: json.message, variant: "destructive" });
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
        toast({ title: "Error", description: "Could not load featured courses", variant: "destructive" });
      }
    };

    fetchFeaturedCourses();
  }, []);
  const handleAddToCart = (course) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to add courses to your cart.",
        variant: "destructive",
      });
      return;
    }
  
    const alreadyInCart = cartItems.find(item => item._id === course._id);
    if (alreadyInCart) {
      toast({
        title: "Already in cart",
        description: `${course.courseName} is already in your cart.`,
        variant: "destructive"
      });
      return;
    }
  
    setCartItems([...cartItems, course]);
    toast({
      title: "Added to cart",
      description: `${course.courseName} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={cartItems.length} />

      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses courses={featuredCourses} onAddToCart={handleAddToCart} />
        <FeatureSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
