import React, { useState } from 'react';
import { toast } from '../components/ui/use-toast';
import HeroSection from '../components/HeroSection';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturedCourses from '../components/FeaturedCourses';
import LeaderboardSection from '../components/LeaderboardSection';
import StudyRoomPreview from '../components/StudyRoomPreview';
import FeatureSection from '../components/FeatureSection';

const Index = () => {
  const [cartItems, setCartItems] = useState([]);

  const featuredCourses = [
    {
      id: '1',
      title: 'Advanced JavaScript: From Fundamentals to Functional JS',
      instructor: 'Dr. Sarah Mitchell',
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      price: 49.99,
      rating: 4.8,
      duration: '20 hours',
      level: 'Intermediate',
      category: 'Web Development'
    },
    {
      id: '2',
      title: 'Machine Learning Fundamentals with Python',
      instructor: 'Prof. Michael Chen',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      price: 59.99,
      rating: 4.9,
      duration: '30 hours',
      level: 'Advanced',
      category: 'Data Science'
    },
    {
      id: '3',
      title: 'UI/UX Design Principles and Best Practices',
      instructor: 'Jessica Lee',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      price: 39.99,
      rating: 4.7,
      duration: '15 hours',
      level: 'Beginner',
      category: 'Design'
    },
    {
      id: '4',
      title: 'Full Stack Web Development with MERN Stack',
      instructor: 'Alex Johnson',
      image: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b',
      price: 69.99,
      rating: 4.6,
      duration: '40 hours',
      level: 'Advanced',
      category: 'Web Development'
    }
  ];

  const leaderboardUsers = [
    {
      id: '1',
      name: 'Emma Thompson',
      avatar: 'https://i.pravatar.cc/100?img=1',
      points: 12500,
      rank: 1,
      level: 'Cosmic Explorer',
    },
    {
      id: '2',
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/100?img=2',
      points: 11200,
      rank: 2,
      level: 'Starship Captain',
    },
    {
      id: '3',
      name: 'Olivia Martinez',
      avatar: 'https://i.pravatar.cc/100?img=3',
      points: 10800,
      rank: 3,
      level: 'Nebula Navigator',
    },
    {
      id: '4',
      name: 'Daniel Johnson',
      avatar: 'https://i.pravatar.cc/100?img=4',
      points: 9600,
      rank: 4,
      level: 'Galaxy Guardian',
    },
    {
      id: '5',
      name: 'Sophia Garcia',
      avatar: 'https://i.pravatar.cc/100?img=5',
      points: 8900,
      rank: 5,
      level: 'Comet Chaser',
    }
  ];

  const handleAddToCart = (course) => {
    const existingCourse = cartItems.find(item => item.id === course.id);
    
    if (existingCourse) {
      toast({
        title: "Already in cart",
        description: `${course.title} is already in your cart.`,
        variant: "destructive"
      });
      return;
    }
    
    setCartItems([...cartItems, course]);
    
    toast({
      title: "Added to cart",
      description: `${course.title} has been added to your cart.`,
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
        <StudyRoomPreview />
        <LeaderboardSection users={leaderboardUsers} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
