import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { PlusCircle, Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useAuthStore } from '../redux/slices/authSlice';
import { useCourseStore } from '../redux/slices/courseSlice';

const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useAuthStore((state) => state.user);
  const courses = useCourseStore((state) => state.courses);
  const getCourses = useCourseStore((state) => state.getCourses);

  useEffect(() => {
    getCourses();
  }, []);

  const instructorCourses = courses.filter(
    (course) => course?.instructor?._id === user?._id
  );

  const totalStudents = instructorCourses.reduce(
    (sum, course) => sum + (course.studentsEnrolled?.length || 0),
    0
  );

  const totalRevenue = instructorCourses.reduce(
    (sum, course) => sum + (course.studentsEnrolled?.length || 0) * (course.price || 0),
    0
  );

  const totalCourses = instructorCourses.length;

  // ✅ Dynamic revenueData from actual courses
  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(0, i).toLocaleString("default", { month: "short" }),
    revenue: 0,
  }));
  const studentsData = instructorCourses.map((course) => ({
    name: course.courseName || "Untitled",
    students: course.studentsEnrolled?.length || 0,
  }));
  // Debug logs to understand why revenue graph shows 0
console.log("📚 Instructor Courses:", instructorCourses);

instructorCourses.forEach((course) => {
  const createdAt = new Date(course.createdAt);
  if (isNaN(createdAt)) {
    console.warn(`⚠️ Skipping invalid date for course: ${course.courseName}`);
    return;
  }

  const month = createdAt.getMonth(); // 0 for Jan, 5 for June
  const revenue = (course.studentsEnrolled?.length || 0) * (course.price || 0);

  console.log(
    `📅 ${course.courseName} | Month: ${month} | ₹${course.price} x ${course.studentsEnrolled?.length || 0} = ₹${revenue}`
  );

  revenueData[month].revenue += revenue;
});

console.log("📊 Final Revenue Graph Data:", revenueData);


  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Instructor Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user?.firstName || 'Instructor'}! Manage your courses and analyze your performance.
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Students</p>
                <h3 className="text-2xl font-bold text-white">{totalStudents}</h3>
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
                <h3 className="text-2xl font-bold text-white">₹{totalRevenue.toFixed(2)}</h3>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-space-light/30 border border-space-light">
            <TabsTrigger value="overview" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
              My Courses
            </TabsTrigger>
           
          </TabsList>

          {/* Overview */}
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
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c3448" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorRevenue)" />
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
                    <RechartsBarChart data={studentsData}>
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

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorCourses.map((course) => (
                <Card key={course._id} className="border-space-light bg-space-light/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">{course.courseName || 'Untitled Course'}</CardTitle>
                    <p className="text-gray-400 text-sm">{course.courseDescription || 'No description provided.'}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-2">
                      Enrolled Students: {course.studentsEnrolled?.length || 0}
                    </p>
                    <Progress value={course.progress || 0} className="mb-2" />
                    <Link to={`/instructor/course/${course._id}/manage`}>
  <Button variant="outline" size="sm" className="w-full">
    Manage Course
  </Button>
</Link>

                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
         
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
