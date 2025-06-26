import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const CourseStructureEditor = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSection, setNewSection] = useState('');
  const [sectionEdits, setSectionEdits] = useState({});
  const [editingSubSectionId, setEditingSubSectionId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [newSubSections, setNewSubSections] = useState({});
  const [subsectionVideos, setSubsectionVideos] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/v1/course/getFullCourseDetails',
        { courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const courseDetails = res.data?.data?.courseDetails;
      setCourseData(courseDetails);
      setFormData({
        courseName: courseDetails?.courseName || '',
        courseDescription: courseDetails?.courseDescription || '',
        price: courseDetails?.price || '',
        instructions: courseDetails?.instructions?.join('\n') || '',
      });
    } catch (err) {
      console.error('❌ Error fetching course:', err);
      toast.error('Failed to load course');
    }
  };

  const handleCourseEdit = async () => {
    const fd = new FormData();
    fd.append('courseId', courseId);
    fd.append('courseName', formData.courseName);
    fd.append('courseDescription', formData.courseDescription);
    fd.append('price', formData.price);
    formData.instructions.split('\n').forEach(i => fd.append('instructions', i));

    try {
      await axios.post('http://localhost:4000/api/v1/course/editCourse', fd, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success('Course updated');
      setEditMode(false);
      fetchCourse();
    } catch {
      toast.error('Error updating course');
    }
  };

  const handleAddSection = async () => {
    if (!newSection.trim()) return;
    try {
      await axios.post(
        'http://localhost:4000/api/v1/course/addSection',
        { courseId, sectionName: newSection },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setNewSection('');
      fetchCourse();
      toast.success('Section added');
    } catch {
      toast.error('Failed to add section');
    }
  };

  const handleUpdateSection = async (sectionId, name) => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/course/updateSection',
        { sectionId, sectionName: name, courseId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success('Section updated');
      fetchCourse();
      setEditingSectionId(null);
    } catch {
      toast.error('Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/course/deleteSection',
        { sectionId, courseId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success('Section deleted');
      fetchCourse();
    } catch {
      toast.error('Error deleting section');
    }
  };

  const handleEditSubsection = async (subSectionId, sectionId, title, description) => {
    const form = new FormData();
    form.append('subSectionId', subSectionId);
    form.append('sectionId', sectionId);
    form.append('title', title);
    form.append('description', description);
    const videoFile = subsectionVideos[sectionId];
    if (videoFile) form.append('videoFile', videoFile);

    try {
      await axios.post('http://localhost:4000/api/v1/course/updateSubSection', form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success('Subsection updated');
      fetchCourse();
      setEditingSubSectionId(null);
    } catch {
      toast.error('Failed to update subsection');
    }
  };

  const handleAddSubsection = async (sectionId) => {
    const { title, description } = newSubSections[sectionId] || {};
    const videoFile = subsectionVideos[sectionId];
    if (!title || !description || !videoFile) return;

    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('video', videoFile);
      form.append('sectionId', sectionId);
      await axios.post('http://localhost:4000/api/v1/course/addSubSection', form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNewSubSections(prev => ({ ...prev, [sectionId]: { title: '', description: '' } }));
      setSubsectionVideos(prev => ({ ...prev, [sectionId]: null }));
      fetchCourse();
      toast.success('Subsection added');
    } catch (error) {
      console.error(error);
      toast.error('Error adding subsection');
    }
  };

  const handleDeleteSubsection = async (subSectionId, sectionId) => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/course/deleteSubSection',
        { subSectionId, sectionId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success('Subsection deleted');
      fetchCourse();
    } catch {
      toast.error('Error deleting subsection');
    }
  };

  if (!courseData) return <div className="text-center mt-10 text-white">Loading course...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 text-white">
<Card className="bg-neutral-800">
  <CardHeader className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">Course Editor</h2>
    <Button onClick={editMode ? handleCourseEdit : () => setEditMode(true)}>
      {editMode ? 'Save' : 'Edit'}
    </Button>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-1">
      <label className="text-sm text-gray-400">Course Name</label>
      <Input
        className="bg-neutral-900"
        disabled={!editMode}
        value={formData.courseName}
        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
        placeholder="Enter course name"
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm text-gray-400">Course Description</label>
      <Input
        className="bg-neutral-900"
        disabled={!editMode}
        value={formData.courseDescription}
        onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
        placeholder="Enter course description"
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm text-gray-400">Price (₹)</label>
      <Input
        className="bg-neutral-900"
        disabled={!editMode}
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Enter course price"
      />
    </div>

    <div className="space-y-1">
      <label className="text-sm text-gray-400">Instructions</label>
      <Textarea
        className="bg-neutral-900"
        disabled={!editMode}
        value={formData.instructions}
        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        placeholder="Write each instruction on a new line"
      />
    </div>
  </CardContent>
</Card>


      <Card className="bg-neutral-800">
        <CardHeader>
          <h3 className="text-xl font-semibold">Sections</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {courseData.courseContent?.map((section) => (
            <div key={section._id} className="border border-neutral-700 p-4 rounded space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Input
                  className="bg-neutral-900"
                  value={sectionEdits[section._id] ?? section.sectionName}
                  onChange={(e) =>
                    setSectionEdits({ ...sectionEdits, [section._id]: e.target.value })
                  }
                />
                <Button size="sm" onClick={() => handleUpdateSection(section._id, sectionEdits[section._id])}>
                  Save
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteSection(section._id)}>
                  Delete
                </Button>
              </div>
              <ul className="pl-4 space-y-2">
                {section.subSection?.map((sub) => (
                  <li key={sub._id} className="border border-neutral-700 p-2 rounded space-y-1">
                    {editingSubSectionId === sub._id ? (
                      <>
                        <Input className="bg-neutral-900" defaultValue={sub.title} onChange={(e) => setNewSubSections(prev => ({ ...prev, [section._id]: { ...prev[section._id], title: e.target.value } }))} />
                        <Input className="bg-neutral-900" defaultValue={sub.description} onChange={(e) => setNewSubSections(prev => ({ ...prev, [section._id]: { ...prev[section._id], description: e.target.value } }))} />
                        <Input type="file" onChange={(e) => setSubsectionVideos(prev => ({ ...prev, [section._id]: e.target.files[0] }))} />
                        <Button size="sm" onClick={() => handleEditSubsection(sub._id, section._id, newSubSections[section._id]?.title || sub.title, newSubSections[section._id]?.description || sub.description)}>Save</Button>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{sub.title}</p>
                        <p className="text-sm text-gray-400">{sub.description}</p>
                        {sub.videoUrl && (<video src={sub.videoUrl} controls className="mt-2 max-w-sm rounded" />)}
                        <Button size="xs" onClick={() => setEditingSubSectionId(sub._id)}>Edit</Button>
                        <Button size="xs" variant="destructive" onClick={() => handleDeleteSubsection(sub._id, section._id)}>Delete</Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* Add new subsection */}
              <div className="space-y-2">
                <Input className="bg-neutral-900" placeholder="Subsection Title" value={newSubSections[section._id]?.title || ''} onChange={(e) => setNewSubSections(prev => ({ ...prev, [section._id]: { ...prev[section._id], title: e.target.value } }))} />
                <Input className="bg-neutral-900" placeholder="Subsection Description" value={newSubSections[section._id]?.description || ''} onChange={(e) => setNewSubSections(prev => ({ ...prev, [section._id]: { ...prev[section._id], description: e.target.value } }))} />
                <Input type="file" className="bg-neutral-900" onChange={(e) => setSubsectionVideos(prev => ({ ...prev, [section._id]: e.target.files[0] }))} />
                <Button size="sm" onClick={() => handleAddSubsection(section._id)}>Add Subsection</Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Input className="bg-neutral-900" value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="New section name" />
            <Button onClick={handleAddSection}>Add Section</Button>
          </div>
        </CardContent>
      </Card>

      {courseData.ratingAndReviews?.length > 0 && (
        <Card className="bg-neutral-800">
          <CardHeader>
            <h3 className="text-xl font-semibold">Ratings & Reviews</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseData.ratingAndReviews.map((review, index) => (
              <div key={index} className="border border-neutral-700 p-4 rounded">
                <p className="text-lg font-semibold text-yellow-400">Rating: {review.rating}/5</p>
                <p className="text-sm text-gray-300">{review.review}</p>
                <p className="text-sm text-gray-400 italic">by: {review.user?.firstName || 'Unknown'} {review.user?.lastName || ''}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseStructureEditor;
