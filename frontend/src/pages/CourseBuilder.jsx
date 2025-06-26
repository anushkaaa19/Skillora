import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShootingStars from '../components/ShootingStars';
import Footer from '../components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sectionName, setSectionName] = useState('');
  const [subForm, setSubForm] = useState({
    title: '',
    description: '',
    videoFile: null,
    videoUrl: '',
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  async function fetchCourse() {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/getCourseDetails`,
        { courseId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setCourse(data.data.courseDetails);
    } catch (e) {
      console.error(e);
      toast({ title: 'Unable to load course', variant: 'destructive' });
    }
  }

  async function handleAddSection() {
    if (!sectionName) return;
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/addSection`,
        { sectionName, courseId },
        { withCredentials: true }
      );
      setCourse(data.data.updatedCourseDetails);
      setSectionName('');
    } catch (e) {
      console.error(e);
      toast({ title: 'Couldn’t add section', variant: 'destructive' });
    }
  }

  async function handleDeleteSection(sectionId) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/deleteSection`,
        { sectionId, courseId },
        { withCredentials: true }
      );
      setCourse(data.data);
    } catch (e) {
      console.error(e);
      toast({ title: 'Couldn’t delete section', variant: 'destructive' });
    }
  }

  async function handleAddSubsection(sectionId) {
    const { title, description, videoFile, videoUrl } = subForm;
    if (!title || !description || (!videoFile && !videoUrl)) {
      return toast({ title: 'Enter all fields', variant: 'destructive' });
    }

    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('sectionId', sectionId);
    if (videoFile) form.append('video', videoFile);
    if (videoUrl) form.append('videoUrl', videoUrl);

    try {
      const { data } = await axios.post(
       ` ${process.env.REACT_APP_API_URL}/v1/course/addSubSection`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      setCourse(data.data);
      setSubForm({ title: '', description: '', videoFile: null, videoUrl: '' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Couldn’t upload subsection', variant: 'destructive' });
    }
  }

  async function handleDeleteSubsection(sectionId, subId) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/deleteSubSection`,
        { sectionId, subSectionId: subId },
        { withCredentials: true }
      );
      setCourse(data.data);
    } catch (e) {
      console.error(e);
      toast({ title: 'Couldn’t delete subsection', variant: 'destructive' });
    }
  }

  return (
    <div className="min-h-screen bg-space text-white">
      <ShootingStars />
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{course?.courseName || 'Loading…'}</h1>

        {/* Add Section Form */}
        <Card className="mb-6 bg-space-light/30 border border-space-light">
          <CardHeader>
            <CardTitle>Add Section</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Section Name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
            <Button className="bg-space-accent" onClick={handleAddSection}>
              Add
            </Button>
          </CardContent>
        </Card>

        {/* Display Sections */}
        {course?.courseContent?.map((section) => (
          <Card key={section._id} className="mb-6 bg-space-light/20 border border-space-light">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{section.sectionName}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section._id)}>
                <Trash2 className="h-5 w-5 text-red-400" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Show Subsections */}
              {section.subSection?.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-space-light/10 rounded p-3 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{sub.title}</p>
                    <p className="text-sm">{sub.description}</p>
                    {sub.videoUrl && (
                      <video controls className="mt-2 max-w-md rounded">
                        <source src={sub.videoUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteSubsection(section._id, sub._id)}
                  >
                    <Trash2 className="text-red-500 h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Add Subsection Form */}
              <div className="space-y-2 mt-4 border-t border-gray-600 pt-4">
                <h3 className="font-semibold text-lg mb-2">Add Subsection</h3>

                <Input
                  placeholder="Subsection Title"
                  value={subForm.title}
                  onChange={(e) =>
                    setSubForm({ ...subForm, title: e.target.value })
                  }
                />

                <Textarea
                  placeholder="Subsection Description"
                  value={subForm.description}
                  onChange={(e) =>
                    setSubForm({ ...subForm, description: e.target.value })
                  }
                />

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`video-upload-${section._id}`).click()
                    }
                  >
                    <Upload className="mr-2" /> Upload Video File
                  </Button>
                  <input
                    type="file"
                    accept="video/*"
                    id={`video-upload-${section._id}`}
                    className="hidden"
                    onChange={(e) =>
                      setSubForm({ ...subForm, videoFile: e.target.files[0] })
                    }
                  />
                  <Input
                    placeholder="Or Video URL"
                    value={subForm.videoUrl}
                    onChange={(e) =>
                      setSubForm({ ...subForm, videoUrl: e.target.value })
                    }
                  />
                </div>

                <Button
                  className="bg-space-accent"
                  onClick={() => handleAddSubsection(section._id)}
                >
                  Add Subsection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Done button */}
        <div className="text-right mt-6">
          <Button className="bg-space-accent" onClick={() => navigate('/instructor/dashboard')}>
            Finish & Go Dashboard
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseBuilder;
