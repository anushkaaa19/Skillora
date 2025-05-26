import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-20 md:py-32 space-bg">
      {/* Animated planet */}
      <div className="absolute top-20 right-10 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-space-secondary to-space-tertiary opacity-20 animate-float blur-2xl"></div>
      
      {/* Small glowing dots */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
      <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse-soft" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 left-3/4 w-2 h-2 bg-white rounded-full animate-pulse-soft" style={{animationDelay: '0.5s'}}></div>
      
      {/* Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-space-accent opacity-10 rounded-full animate-rotate-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-space-accent via-purple-300 to-space-secondary">
            Launch Your Learning Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Explore the universe of knowledge with Skillora's interactive courses, live study rooms, and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-space-accent hover:bg-space-secondary text-white font-medium">
                Explore Courses
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white font-medium">
                Join Skillora
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-space-accent">500+</p>
              <p className="text-sm text-gray-400">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-space-accent">100K+</p>
              <p className="text-sm text-gray-400">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-space-accent">200+</p>
              <p className="text-sm text-gray-400">Instructors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
