import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { BookOpen, Award, Clock, CheckCircle, Play, Download } from 'lucide-react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../redux/slices/authSlice';
import { useCourseStore } from '../redux/slices/courseSlice';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('myCourses');
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const courses = useCourseStore((state) => state.courses);
  const setCourses = useCourseStore((state) => state.setCourses);
  const [progressData, setProgressData] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [learningHours, setLearningHours] = useState(0);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user || !token) {
        navigate('/login');
      } else {
        setIsLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, token, navigate]);

  // Fetch learning hours
  useEffect(() => {
    if (!token) return;
    const fetchLearningHours = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/course/dashboard/learning-hours`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setLearningHours(res.data?.data || 0);
      } catch (err) {
        console.error("Failed to fetch learning hours:", err);
      }
    };
    fetchLearningHours();
  }, [token]);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/course/getAllCourses`);
        const data = await res.json();
        if (data.success) setCourses(data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, [setCourses]);

  // Filter enrolled courses
  const enrolledCourses = courses.filter(course =>
    course.studentsEnrolled?.some(id => id.toString() === user?._id)
  );

  // Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!token || !user) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/course/dashboard/progress`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setProgressData(res.data?.data || {});
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };
    if (!isLoading) fetchProgress();
  }, [token, user, isLoading]);

  // Issue certificates
  useEffect(() => {
    const issueCertificates = async () => {
      if (!token || !user || Object.keys(progressData).length === 0) return;
      for (const course of enrolledCourses) {
        const courseId = course?._id;
        const progress = progressData[courseId] || 0;
        if (progress === 100 && courseId) {
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/v1/certificate/issue`,
              { courseId },
              {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
          } catch (err) {
            console.error("Failed to issue certificate:", err.response || err.message);
          }
        }
      }
    };
    if (!isLoading) issueCertificates();
  }, [progressData, enrolledCourses, token, user, isLoading]);

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/certificate/issue`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const allCerts = res.data?.data || [];
        const unique = {};
        for (const cert of allCerts) {
          const id = cert?.course?._id;
          if (id && !unique[id]) unique[id] = cert;
        }
        setCertificates(Object.values(unique));
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
        setCertificates([]);
      }
    };
    if (!isLoading) fetchCertificates();
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-space space-bg">
        <ShootingStars />
        <Navbar cartItemCount={0} />
        <main className="flex-grow container mx-auto py-12 px-4 md:px-6 flex items-center justify-center">
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-space-accent border-t-transparent mx-auto mb-6"></div>
              <h2 className="text-xl text-white mb-2">Loading Dashboard...</h2>
              <p className="text-gray-400">Please wait while we load your data.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />

      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.firstName || 'Student'}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<BookOpen />} color="purple" title="Enrolled Courses" value={enrolledCourses.length} />
          <StatCard
            icon={<Clock />}
            color="blue"
            title="Learning Hours"
            value={`${learningHours} hrs`}
          />
          <StatCard icon={<CheckCircle />} color="green" title="Completed" value={certificates.length} />
          <StatCard icon={<Award />} color="yellow" title="Certificates" value={certificates.length} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-space-light/30 border border-space-light">
            <TabsTrigger value="myCourses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          </TabsList>

          {/* === Courses Tab === */}
          <TabsContent value="myCourses">
            <h2 className="text-xl font-semibold text-white mb-4">In Progress</h2>
            
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => {
                const progress = progressData[course._id] || 0;
                const totalModules = course.courseContent?.length || 1;
                const completedModules = Math.floor((progress / 100) * totalModules);
                const remainingModules = totalModules - completedModules;

                return (
                  <Card key={course._id} className="mb-6 border-space-light bg-space-light/30 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <img 
                          src={course.thumbnail} 
                          alt={course.courseName} 
                          className="w-full sm:w-48 h-40 object-cover" 
                        />
                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-semibold text-white mb-2">{course.courseName}</h3>
                          <p className="text-gray-400 mb-2">
                            Instructor: {course.instructor?.firstName || 'Unknown'} {course.instructor?.lastName || ''}
                          </p>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-gray-700" />
                          </div>
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>
                              {progress < 100 
                                ? `${remainingModules} module${remainingModules !== 1 ? 's' : ''} remaining` 
                                : 'Course completed'
                              }
                            </span>
                            <Link to={`/dashboard/course/${course._id}`}>
                              <Button className="bg-space-accent hover:bg-space-secondary">
                                <Play className="h-4 w-4 mr-2" /> Continue Learning
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Courses Enrolled</h3>
                  <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses">
                    <Button className="bg-space-accent hover:bg-space-secondary">
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {enrolledCourses.length > 0 && (
              <Link to="/courses">
                <Button variant="outline" className="w-full mt-4 border-space-light text-white hover:bg-space-light">
                  Explore More Courses
                </Button>
              </Link>
            )}
          </TabsContent>

          {/* === Certificates Tab === */}
          <TabsContent value="certificates">
            {console.log("🧾 All certificates:", certificates)}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.length > 0 ? (
                certificates.map(cert => (
                  <Card key={cert._id} className="border-space-light bg-space-light/30 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-space-accent/20 to-space-secondary/20">
                      <CardTitle className="text-white flex justify-between items-center">
                        <span>Certificate of Completion</span>
                        <Award className="h-8 w-8 text-yellow-400" />
                      </CardTitle>
                      <p className="text-gray-400 text-sm">{cert.course?.courseName}</p>
                    </CardHeader>
                    <CardContent className="text-gray-300">
                      <p><strong>Instructor:</strong> {cert.course?.instructor?.firstName || 'Unknown'} {cert.course?.instructor?.lastName || ''}</p>
                      <div className="mt-4 flex justify-end">
                        <a
                          href={cert.certificateUrl + "?fl_attachment=" + encodeURIComponent(cert.course?.courseName || "certificate")}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-500/10">
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-space-light bg-space-light/30 backdrop-blur-sm col-span-2">
                  <CardContent className="p-8 text-center">
                    <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
                    <p className="text-gray-400">Complete courses to earn certificates!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* === Progress Tab === */}
          <TabsContent value="progress">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">Overall Learning Progress</h2>
              
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map(course => (
                  <div key={course._id} className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>{course.courseName}</span>
                      <span>{progressData[course._id] || 0}%</span>
                    </div>
                    <Progress value={progressData[course._id] || 0} className="h-3 bg-gray-700" />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No enrolled courses to track progress.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, color, title, value }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400', 
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
      <CardContent className="p-6 flex items-center">
        <div className={`${colorClasses[color]} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDashboard;