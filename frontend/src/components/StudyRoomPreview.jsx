import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const StudyRoomPreview = () => { 
  return (
    <div className="py-20 container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Join Live Study Rooms</h2>
          <p className="text-gray-400 mb-6">
            Connect with fellow learners in real-time study sessions. Ask questions, share insights, and learn together in a collaborative environment.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-space-accent/20 p-2 rounded-full">
                <svg className="h-6 w-6 text-space-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Real-time Discussions</h3>
                <p className="text-gray-400 mt-1">
                  Chat with instructors and students in real-time to get immediate answers to your questions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-space-accent/20 p-2 rounded-full">
                <svg className="h-6 w-6 text-space-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Video Learning</h3>
                <p className="text-gray-400 mt-1">
                  Join video study sessions with screen sharing capabilities to learn complex topics together.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-space-accent/20 p-2 rounded-full">
                <svg className="h-6 w-6 text-space-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">Doubt Solving</h3>
                <p className="text-gray-400 mt-1">
                  Get help with difficult concepts from peers and instructors who can guide you through problems.
                </p>
              </div>
            </div>
          </div>
          
          <Link to="/study-room">
            <Button size="lg" className="bg-space-accent hover:bg-space-secondary text-white">
              Enter Study Room
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-space-light/30 border-space-light p-4 hover:border-space-accent transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-white">Web Development</h4>
              <Badge className="bg-green-500">Live</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">React Hooks Deep Dive</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
                <div className="w-7 h-7 rounded-full bg-space-accent/50 flex items-center justify-center text-xs text-white border-2 border-space">
                  +5
                </div>
              </div>
              <div className="text-xs text-gray-400">Started 10m ago</div>
            </div>
          </Card>
          
          <Card className="bg-space-light/30 border-space-light p-4 hover:border-space-accent transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-white">Machine Learning</h4>
              <Badge className="bg-green-500">Live</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">Neural Networks Basics</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=4" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
                <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
                <div className="w-7 h-7 rounded-full bg-space-accent/50 flex items-center justify-center text-xs text-white border-2 border-space">
                  +8
                </div>
              </div>
              <div className="text-xs text-gray-400">Started 25m ago</div>
            </div>
          </Card>
          
          <Card className="bg-space-light/30 border-space-light p-4 hover:border-space-accent transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-white">Data Structures</h4>
              <Badge className="bg-blue-500">Starting Soon</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">Graph Algorithms</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=7" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
                <img src="https://i.pravatar.cc/100?img=8" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
              </div>
              <div className="text-xs text-gray-400">Starts in 5m</div>
            </div>
          </Card>
          
          <Card className="bg-space-light/30 border-space-light p-4 hover:border-space-accent transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-white">UX Design</h4>
              <Badge className="bg-purple-500">Scheduled</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">User Research Methods</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=10" alt="User" className="w-7 h-7 rounded-full border-2 border-space" />
              </div>
              <div className="text-xs text-gray-400">Today, 4:00 PM</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyRoomPreview;
