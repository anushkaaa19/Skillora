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
  
  // Get instructor courses (in a real app, you'd filter by instructor ID)
  const instructorCourses = courses.slice(0, 4);
  
  // Calculate some stats
  const totalStudents = 312; // This would come from the backend
  const totalRevenue = 9845.75; // This would come from the backend
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
                      <Bar dataKey="students" fill="#22c55e" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorCourses.map((course) => (
                <Card key={course.id} className="border-space-light bg-space-light/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">{course.title}</CardTitle>
                    <p className="text-gray-400 text-sm">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-2">Enrolled Students: {course.enrolledCount || 0}</p>
                    <Progress value={course.progress || 0} className="mb-2" />
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-6">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm p-6">
              <p className="text-gray-400">Detailed student information and messaging features would be implemented here.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm p-6">
              <p className="text-gray-400">Advanced analytics and insights would be implemented here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
