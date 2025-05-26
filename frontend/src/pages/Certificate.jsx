import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Download, Share2, ChevronLeft } from 'lucide-react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppSelector } from '../redux/hooks';
import { toast } from '../hooks/use-toast';

const Certificate = () => {
  const { courseId } = useParams();
  const { user } = useAppSelector(state => state.auth);
  const { courses } = useAppSelector(state => state.courses);

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-space space-bg">
        <ShootingStars />
        <Navbar cartItemCount={0} />
        <main className="flex-grow flex items-center justify-center">
          <Card className="border-space-light bg-space-light/30 backdrop-blur-sm p-8 max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Certificate Not Found</h2>
              <p className="text-gray-300 mb-6">The certificate you're looking for does not exist or you don't have access to it.</p>
              <Link to="/student/dashboard">
                <Button className="bg-space-accent hover:bg-space-secondary">
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleDownload = () => {
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Your Achievement",
      description: "Share your certificate on LinkedIn, Twitter or Facebook.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />

      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="mb-8 flex items-center">
          <Link to="/student/dashboard" className="mr-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-space-light/50">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-1">Your Certificate</h1>
            <p className="text-gray-400">
              Congratulations on completing {course.title}!
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-space-accent/10 via-purple-900/5 to-space-secondary/20 rounded-lg transform scale-105 blur-xl -z-10"></div>

            <Card className="border-2 border-space-accent/50 bg-space/90 backdrop-blur-md overflow-hidden">
              <div className="p-8 md:p-16 relative">
                <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-space-accent/30"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-space-accent/30"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-space-accent/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-space-secondary/10 rounded-full filter blur-2xl"></div>

                <div className="relative z-10 text-center">
                  <div className="inline-block mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-space-accent to-space-secondary flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15L8.5 8L15.5 8L12 15Z" fill="white"/>
                        <path d="M12 8L13.5 5L10.5 5L12 8Z" fill="white"/>
                        <path d="M12 17L13 19H11L12 17Z" fill="white"/>
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">Certificate of Completion</h2>
                  <p className="text-gray-300 mb-10">This is to certify that</p>

                  <h3 className="text-3xl md:text-4xl font-serif italic text-space-accent mb-4">{user?.name || "Student Name"}</h3>

                  <p className="text-gray-300 mb-2">has successfully completed the course</p>
                  <h4 className="text-2xl md:text-2xl font-heading font-bold text-white mb-8">{course.title}</h4>

                  <div className="flex justify-center space-x-16 mb-10">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">INSTRUCTOR</p>
                      <p className="text-lg text-white">{course.instructor}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">DATE</p>
                      <p className="text-lg text-white">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="w-48 h-1 bg-gradient-to-r from-space-accent to-space-secondary mx-auto mb-4"></div>

                  <p className="text-sm text-gray-400">
                    Verify this certificate at skillora.com/verify with ID: CERT-{courseId}-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <Button 
              variant="outline" 
              className="border-space-light text-white hover:bg-space-light"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" /> Download Certificate
            </Button>
            <Button 
              className="bg-space-accent hover:bg-space-secondary"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" /> Share Certificate
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Certificate;
