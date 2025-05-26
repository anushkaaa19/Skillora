
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { ChevronLeft, Upload, Plus, Trash2 } from 'lucide-react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';
import { useAppDispatch } from '../redux/hooks';
import { addCourse } from '../redux/slices/courseSlice';

const CourseCreator = () => {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Course information state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Modules state
  const [modules, setModules] = useState([
    { title: "", description: "", lessons: [{ title: "", duration: "", type: "video" }] }
  ]);
  
  const handleAddModule = () => {
    setModules([...modules, { title: "", description: "", lessons: [{ title: "", duration: "", type: "video" }] }]);
  };
  
  const handleUpdateModule = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };
  
  const handleRemoveModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };
  
  const handleAddLesson = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({ title: "", duration: "", type: "video" });
    setModules(updatedModules);
  };
  
  const handleUpdateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value
    };
    setModules(updatedModules);
  };
  
  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(updatedModules);
  };
  
  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    // For now, let's simulate with placeholder images
    const placeholders = [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNwYWNlfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1501862700950-18382cd41497?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNwYWNlfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJvY2tldHxlbnwwfHwwfHx8MA%3D%3D"
    ];
    
    setImageUrl(placeholders[Math.floor(Math.random() * placeholders.length)]);
    toast({
      title: "Image uploaded",
      description: "Your course image has been uploaded successfully."
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !description || !category || !level || !price || !duration || !imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Create the course
    const newCourse = {
      id: `course-${Date.now()}`,
      title,
      instructor: "You", // In a real app, this would come from the auth user
      image: imageUrl,
      price: parseFloat(price),
      rating: 0,
      duration,
      level: level,
      category
    };

    // Dispatch action to add the course
    dispatch(addCourse(newCourse));
    
    toast({
      title: "Course created successfully",
      description: "Your new course has been published.",
    });

    // Navigate to instructor dashboard
    navigate('/instructor/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4 text-white hover:bg-space-light/50"
            onClick={() => navigate('/instructor/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-1">Create New Course</h1>
            <p className="text-gray-400">
              Fill in the details to create and publish your course.
            </p>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="bg-space-light/30 border border-space-light">
                <TabsTrigger value="basicInfo" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                  Curriculum
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basicInfo" className="space-y-6">
                <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Introduction to Astrophysics"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-space-light/50 border-space-light text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed description of your course..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-32 bg-space-light/50 border-space-light text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-space-light/50 border-space-light text-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Astronomy">Astronomy</SelectItem>
                            <SelectItem value="Astrophysics">Astrophysics</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Medicine">Medicine</SelectItem>
                            <SelectItem value="Law">Law</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Level</Label>
                        <RadioGroup value={level} onValueChange={(value) => setLevel(value)} className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Beginner" id="beginner" className="border-space-accent text-space-accent" />
                            <Label htmlFor="beginner" className="text-gray-300">Beginner</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Intermediate" id="intermediate" className="border-space-accent text-space-accent" />
                            <Label htmlFor="intermediate" className="text-gray-300">Intermediate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Advanced" id="advanced" className="border-space-accent text-space-accent" />
                            <Label htmlFor="advanced" className="text-gray-300">Advanced</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g., 49.99"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="bg-space-light/50 border-space-light text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 6 weeks"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="bg-space-light/50 border-space-light text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Course Thumbnail</Label>
                      <div className="flex items-center gap-6">
                        {imageUrl ? (
                          <div className="relative w-48 h-32 rounded-md overflow-hidden">
                            <img 
                              src={imageUrl} 
                              alt="Course thumbnail" 
                              className="w-full h-full object-cover"
                            />
                            <Button 
                              type="button"
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => setImageUrl("")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-48 h-32 border-2 border-dashed border-space-light rounded-md flex items-center justify-center bg-space-light/10">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        
                        <Button 
                          type="button"
                          variant="outline" 
                          className="border-space-light text-white hover:bg-space-light"
                          onClick={handleImageUpload}
                        >
                          <Upload className="h-4 w-4 mr-2" /> Upload Image
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Recommended size: 1280x720px. Max size: 2MB.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button"
                        className="bg-space-accent hover:bg-space-secondary"
                        onClick={() => setActiveTab("curriculum")}
                      >
                        Next: Curriculum
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum" className="space-y-6">
                <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Course Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-400">
                      Organize your course into modules and lessons. Each module should cover a specific topic.
                    </p>
                    
                    {modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="p-4 border border-space-light rounded-md bg-space-light/20">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-white font-semibold">Module {moduleIndex + 1}</h3>
                          {modules.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8"
                              onClick={() => handleRemoveModule(moduleIndex)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div className="space-y-2">
                            <Label htmlFor={`module-${moduleIndex}-title`}>Module Title</Label>
                            <Input
                              id={`module-${moduleIndex}-title`}
                              placeholder="e.g., Introduction to Black Holes"
                              value={module.title}
                              onChange={(e) => handleUpdateModule(moduleIndex, "title", e.target.value)}
                              className="bg-space-light/50 border-space-light text-white"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`module-${moduleIndex}-description`}>Module Description</Label>
                            <Textarea
                              id={`module-${moduleIndex}-description`}
                              placeholder="Brief description of this module..."
                              value={module.description}
                              onChange={(e) => handleUpdateModule(moduleIndex, "description", e.target.value)}
                              className="bg-space-light/50 border-space-light text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4 ml-4">
                          <h4 className="text-gray-300 font-medium">Lessons</h4>
                          
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="p-3 border border-space-light/70 rounded bg-space-light/10">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="text-gray-300">Lesson {lessonIndex + 1}</h5>
                                {module.lessons.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 px-2"
                                    onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                                  </Button>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label htmlFor={`lesson-${moduleIndex}-${lessonIndex}-title`} className="text-xs">Title</Label>
                                    <Input
                                      id={`lesson-${moduleIndex}-${lessonIndex}-title`}
                                      placeholder="e.g., Introduction Video"
                                      value={lesson.title}
                                      onChange={(e) => handleUpdateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                                      className="bg-space-light/50 border-space-light text-white h-8 text-sm"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`lesson-${moduleIndex}-${lessonIndex}-duration`} className="text-xs">Duration</Label>
                                    <Input
                                      id={`lesson-${moduleIndex}-${lessonIndex}-duration`}
                                      placeholder="e.g., 10:30"
                                      value={lesson.duration}
                                      onChange={(e) => handleUpdateLesson(moduleIndex, lessonIndex, "duration", e.target.value)}
                                      className="bg-space-light/50 border-space-light text-white h-8 text-sm"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <Label htmlFor={`lesson-${moduleIndex}-${lessonIndex}-type`} className="text-xs">Content Type</Label>
                                  <Select 
                                    value={lesson.type} 
                                    onValueChange={(value) => handleUpdateLesson(moduleIndex, lessonIndex, "type", value)}
                                  >
                                    <SelectTrigger className="bg-space-light/50 border-space-light text-white h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="quiz">Quiz</SelectItem>
                                      <SelectItem value="reading">Reading</SelectItem>
                                      <SelectItem value="assignment">Assignment</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-space-light text-white hover:bg-space-light"
                            onClick={() => handleAddLesson(moduleIndex)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Lesson
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-space-light text-white hover:bg-space-light"
                      onClick={handleAddModule}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Module
                    </Button>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        className="border-space-light text-white hover:bg-space-light"
                        onClick={() => setActiveTab("basicInfo")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button"
                        className="bg-space-accent hover:bg-space-secondary"
                        onClick={() => setActiveTab("settings")}
                      >
                        Next: Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Course Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select defaultValue="public">
                          <SelectTrigger className="bg-space-light/50 border-space-light text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="enrollment">Enrollment</Label>
                        <Select defaultValue="open">
                          <SelectTrigger className="bg-space-light/50 border-space-light text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="invite">Invite Only</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        className="border-space-light text-white hover:bg-space-light"
                        onClick={() => setActiveTab("curriculum")}
                      >
                        Back
                      </Button>
                      <div className="space-x-3">
                        <Button 
                          type="button"
                          variant="outline"
                          className="border-space-light text-white hover:bg-space-light"
                        >
                          Save as Draft
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-space-accent hover:bg-space-secondary"
                        >
                          Publish Course
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseCreator;