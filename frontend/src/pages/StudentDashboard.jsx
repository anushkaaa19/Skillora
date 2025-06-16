import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Calendar, BookOpen, Award, Clock, CheckCircle, Play, Download } from 'lucide-react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../redux/slices/authSlice'; // ✅ Zustand
import { useCourseStore } from '../redux/slices/courseSlice'; // ✅ adjust the path

import Footer from '../components/Footer';
import { Course } from '../components/CourseCard';  // If this is TS only, you may remove this import in JS

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('myCourses');
  const { user } = useAuthStore(); // ✅ Zustand user access
  const courses = useCourseStore((state) => state.courses); // ✅ Zustand
  
  // Get enrolled courses (in a real app, this would come from the user's enrollment data)
  const enrolledCourses = courses.slice(0, 3);
  
  // Sample certificates - in a real app this would come from the backend
  const certificates = [
    {
      id: "cert-1",
      courseId: "1",
      title: "Introduction to Astronomy: Exploring Our Universe",
      issueDate: "2025-03-15",
      instructor: "Dr. Sarah Thompson"
    },
    {
      id: "cert-2",
      courseId: "2",
      title: "Advanced Astrophysics: Black Holes & Dark Matter",
      issueDate: "2025-02-28",
      instructor: "Prof. Michael Chen"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {user?.name || 'Student'}! Continue your learning journey.
          </p>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Enrolled Courses</p>
                <h3 className="text-2xl font-bold text-white">{enrolledCourses.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Learning Hours</p>
                <h3 className="text-2xl font-bold text-white">42.5</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-green-500/20 p-3 rounded-full mr-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <h3 className="text-2xl font-bold text-white">2</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Certificates</p>
                <h3 className="text-2xl font-bold text-white">{certificates.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-space-light/30 border border-space-light">
            <TabsTrigger value="myCourses" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Learning Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="myCourses" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* In progress courses */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">In Progress</h2>
                
                {enrolledCourses.map((course, index) => {
                  // Generate progress value for demo
                  const progress = [45, 72, 21][index];
                  
                  return (
                    <Card key={course.id} className="border-space-light bg-space-light/30 backdrop-blur-sm">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-48 h-40">
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-heading font-semibold text-white mb-2">{course.title}</h3>
                              <p className="text-gray-400 mb-2">Instructor: {course.instructor}</p>
                              
                              <div className="space-y-1 mb-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm">Progress</span>
                                  <span className="text-white text-sm font-medium">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-gray-700" />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-gray-400 text-sm">
                                {progress < 100 ? `${10 - Math.floor(progress / 10)} modules remaining` : 'Course completed'}
                              </div>
                              <Button className="bg-space-accent hover:bg-space-secondary">
                                <Play className="h-4 w-4 mr-2" /> Continue Learning
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                <Link to="/courses" className="block mt-4">
                  <Button variant="outline" className="w-full border-space-light text-white hover:bg-space-light">
                    Explore More Courses
                  </Button>
                </Link>
              </div>
              
              {/* Recent activities */}
              <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-space-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      { activity: "Completed module 3 in 'Introduction to Astronomy'", time: "2 hours ago" },
                      { activity: "Achieved 75% on 'Black Holes' quiz", time: "Yesterday" },
                      { activity: "Started new course 'Rocket Science Fundamentals'", time: "2 days ago" },
                      { activity: "Earned certificate for 'Advanced Astrophysics'", time: "1 week ago" }
                    ].map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-gray-300">{item.activity}</span>
                        <span className="text-sm text-gray-500">{item.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="certificates" className="space-y-6">
            {/* Certificate cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(certificate => (
                <Card 
                  key={certificate.id} 
                  className="border-space-light bg-space-light/30 backdrop-blur-sm overflow-hidden"
                >
                  <div className="border-b border-space-light p-6 bg-gradient-to-r from-space-accent/20 to-space-secondary/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-white mb-1">Certificate of Completion</h3>
                        <p className="text-gray-400 text-sm">{certificate.title}</p>
                      </div>
                      <Award className="h-10 w-10 text-yellow-400" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6 text-gray-300">
                    <p><strong>Issued on:</strong> {certificate.issueDate}</p>
                    <p><strong>Instructor:</strong> {certificate.instructor}</p>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-500/10">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            {/* Learning progress summary */}
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">Overall Learning Progress</h2>
              
              {enrolledCourses.map((course, idx) => {
                const progress = [45, 72, 21][idx];
                return (
                  <div key={course.id} className="mb-6">
                    <div className="flex justify-between items-center mb-1 text-gray-400">
                      <span>{course.title}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-gray-700" />
                  </div>
                );
              })}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
