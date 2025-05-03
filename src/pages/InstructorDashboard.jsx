import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Users, BookOpen, DollarSign, TrendingUp, Calendar, BarChart, DownloadCloud } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import ShootingStars from '@/components/ShootingStars';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppSelector } from '@/redux/hooks';

// Sample data for charts
const revenueData = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Feb', revenue: 1398 },
  { name: 'Mar', revenue: 9800 },
  { name: 'Apr', revenue: 3908 },
  { name: 'May', revenue: 4800 },
  { name: 'Jun', revenue: 3800 },
  { name: 'Jul', revenue: 4300 },
];

const studentsData = [
  { name: 'Astronomy 101', students: 120 },
  { name: 'Physics for Space', students: 85 },
  { name: 'Rocket Science', students: 65 },
  { name: 'Space Law', students: 42 },
];

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAppSelector(state => state.auth);
  const { courses } = useAppSelector(state => state.courses);
  
  // Get instructor courses
  const instructorCourses = courses.slice(0, 4);
  
  // Calculate some stats
  const totalStudents = 312;
  const totalRevenue = 9845.75;
  const totalCourses = instructorCourses.length;

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Instructor Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user?.name || 'Instructor'}! Manage your courses and analyze your performance.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/instructor/courses/create">
              <Button className="bg-space-accent hover:bg-space-secondary text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Students</p>
                <h3 className="text-2xl font-bold text-white">{totalStudents}</h3>
                <p className="text-xs text-green-400">+24% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</h3>
                <p className="text-xs text-green-400">+12% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-emerald-500/20 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Courses</p>
                <h3 className="text-2xl font-bold text-white">{totalCourses}</h3>
                <p className="text-xs text-gray-400">across {totalCourses} categories</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-space-light/30 border border-space-light">
            <TabsTrigger value="overview" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-space-accent" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c3448" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-space-accent" />
                    Students per Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsBarChart data={studentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c3448" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                      <Bar dataKey="students" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
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
                    { activity: "New student enrolled in 'Introduction to Astronomy'", time: "2 hours ago" },
                    { activity: "Course rating received: 5 stars for 'Advanced Astrophysics'", time: "1 day ago" },
                    { activity: "New question posted in 'Rocket Science Fundamentals'", time: "2 days ago" },
                    { activity: "Course material updated for 'Space Law'", time: "3 days ago" }
                  ].map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{item.activity}</span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course cards */}
              {instructorCourses.map(course => (
                <Card key={course.id} className="border-space-light bg-space-light/30 backdrop-blur-sm overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Students</span>
                      <span className="text-white font-semibold">{Math.floor(Math.random() * 100) + 20}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Rating</span>
                        <span className="text-white font-semibold">{course.rating.toFixed(1)}/5</span>
                      </div>
                      <Progress value={course.rating * 20} className="h-2 bg-gray-700" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-white font-semibold">${(course.price * (Math.floor(Math.random() * 100) + 20)).toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-2 flex justify-between">
                      <Button variant="outline" className="border-space-light text-white hover:bg-space-light">
                        Edit Course
                      </Button>
                      <Button className="bg-space-accent hover:bg-space-secondary">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new course card */}
              <Link to="/instructor/courses/create" className="h-full">
                <Card className="border-space-light border-dashed bg-transparent backdrop-blur-sm hover:bg-space-light/10 transition-all h-full flex flex-col justify-center items-center p-8 cursor-pointer">
                  <div className="text-center">
                    <PlusCircle className="h-12 w-12 mx-auto mb-4 text-space-accent" />
                    <h3 className="text-xl font-semibold text-white mb-2">Create New Course</h3>
                    <p className="text-gray-400">Add a new course to your teaching portfolio</p>
                  </div>
                </Card>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-6">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-space-light overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-space-light/50">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">Student Name</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">Course</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">Progress</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">Enrolled Date</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Alex Johnson", course: "Introduction to Astronomy", progress: 75, date: "Apr 12, 2025" },
                        { name: "Maria Garcia", course: "Advanced Astrophysics", progress: 45, date: "Apr 10, 2025" },
                        { name: "James Wilson", course: "Rocket Science Fundamentals", progress: 90, date: "Apr 5, 2025" },
                        { name: "Sarah Lee", course: "Space Medicine", progress: 20, date: "Apr 2, 2025" },
                        { name: "David Kim", course: "Introduction to Space Law", progress: 60, date: "Mar 28, 2025" }
                      ].map((student, index) => (
                        <tr key={index} className="border-t border-space-light">
                          <td className="py-3 px-4 text-white">{student.name}</td>
                          <td className="py-3 px-4 text-gray-300">{student.course}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Progress value={student.progress} className="h-2 w-20 bg-gray-700" />
                              <span className="text-gray-300">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{student.date}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="hover:text-space-accent">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-space-accent" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {instructorCourses.map(course => (
                      <div key={course.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">{course.title}</span>
                          <span className="text-white font-semibold">${(course.price * (Math.floor(Math.random() * 100) + 20)).toFixed(2)}</span>
                        </div>
                        <Progress 
                          value={Math.random() * 100} 
                          className="h-2 bg-gray-700" 
                          style={{ 
                            '--theme-primary': `hsl(${180 + Math.floor(Math.random() * 180)}, 70%, 50%)` 
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-space-light">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-300">Total Revenue</span>
                      <span className="text-white font-bold">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-space-light/20 rounded-lg">
                    <div>
                      <p className="text-gray-400 text-sm">Average Course Rating</p>
                      <p className="text-xl font-semibold text-white">4.8/5.0</p>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mx-0.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-space-light/20 rounded-lg">
                    <div>
                      <p className="text-gray-400 text-sm">Course Completion Rate</p>
                      <p className="text-xl font-semibold text-white">73%</p>
                    </div>
                    <Progress value={73} className="h-2 w-20 bg-gray-700" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-space-light/20 rounded-lg">
                    <div>
                      <p className="text-gray-400 text-sm">Student Engagement</p>
                      <p className="text-xl font-semibold text-white">High</p>
                    </div>
                    <div className="text-emerald-500">↑ 12%</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-space-light/20 rounded-lg">
                    <div>
                      <p className="text-gray-400 text-sm">Return Students</p>
                      <p className="text-xl font-semibold text-white">68%</p>
                    </div>
                    <div className="text-emerald-500">↑ 5%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Analytics Reports</CardTitle>
                <Button variant="outline" className="border-space-light text-white hover:bg-space-light">
                  <DownloadCloud className="h-4 w-4 mr-2" /> Export Reports
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Monthly Revenue Report", date: "May 2025", type: "PDF" },
                    { name: "Student Engagement Analysis", date: "Apr 2025", type: "XLSX" },
                    { name: "Course Completion Statistics", date: "Apr 2025", type: "PDF" },
                    { name: "Feedback Summary", date: "Mar 2025", type: "PDF" },
                    { name: "Q1 Performance Review", date: "Mar 2025", type: "PPTX" },
                    { name: "Yearly Comparison Report", date: "Feb 2025", type: "PDF" }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-space-light rounded-lg">
                      <div>
                        <p className="text-white font-medium">{report.name}</p>
                        <p className="text-sm text-gray-400">{report.date}</p>
                      </div>
                      <span className="text-xs bg-space-accent/20 text-space-accent px-2 py-1 rounded">
                        {report.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorDashboard;