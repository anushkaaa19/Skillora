import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { BookOpen, Briefcase, Award, Link as LinkIcon, MapPin, Mail, Trash, Plus, Save } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { 
  updateBio, 
  addEducation, 
  updateEducation, 
  removeEducation, 
  addExperience, 
  updateExperience, 
  removeExperience, 
  addSkill, 
  removeSkill 
} from '../redux/slices/profileSlice';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { v4 as uuidv4 } from 'uuid';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { bio, location, website, education, experience, skills, socialLinks } = useAppSelector(state => state.profile);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [bioText, setBioText] = useState(bio);
  const [locationText, setLocationText] = useState(location);
  const [websiteText, setWebsiteText] = useState(website);
  
  // Education form state
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false
  });
  
  // Experience form state
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  
  // Skill form state
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 'intermediate'
  });
  
  const handleSaveBio = () => {
    dispatch(updateBio(bioText));
  };
  
  const handleAddEducation = () => {
    dispatch(addEducation({
      id: uuidv4(),
      ...newEducation
    }));
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    });
  };
  
  const handleAddExperience = () => {
    dispatch(addExperience({
      id: uuidv4(),
      ...newExperience
    }));
    setNewExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };
  
  const handleAddSkill = () => {
    dispatch(addSkill({
      id: uuidv4(),
      ...newSkill
    }));
    setNewSkill({
      name: '',
      proficiency: 'intermediate'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">
              Manage your personal information and profile details
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="md:col-span-1">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-space-accent mb-4">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-space-accent flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                  <p className="text-gray-400">{user?.role === 'instructor' ? 'Instructor' : 'Student'}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">{user?.email}</span>
                  </div>
                  
                  {location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">{location}</span>
                    </div>
                  )}
                  
                  {website && (
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={website} target="_blank" rel="noopener noreferrer" className="text-space-accent hover:underline">
                        {website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6 bg-space-light" />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Quick Links</h4>
                  <div className="space-y-1">
                    <Link 
                      to={user?.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'} 
                      className="text-space-accent hover:text-space-secondary flex items-center"
                    >
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/courses" 
                      className="text-space-accent hover:text-space-secondary flex items-center"
                    >
                      <span>Courses</span>
                    </Link>
                    {user?.role === 'instructor' && (
                      <Link 
                        to="/instructor/courses/create" 
                        className="text-space-accent hover:text-space-secondary flex items-center"
                      >
                        <span>Create Course</span>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Content - Profile Tabs */}
          <div className="md:col-span-2">
            <Card className="border-space-light bg-space-light/30 backdrop-blur-sm">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-space-light/30 border border-space-light">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="education" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                      Education
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                      Skills
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="profile" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                          <div className="mt-1">
                            <textarea
                              id="bio"
                              rows={4}
                              value={bioText}
                              onChange={(e) => setBioText(e.target.value)}
                              className="w-full rounded-md border border-space-light bg-space/50 text-white p-3"
                              placeholder="Write a short bio about yourself..."
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location" className="text-gray-300">Location</Label>
                            <Input 
                              id="location" 
                              value={locationText}
                              onChange={(e) => setLocationText(e.target.value)}
                              className="bg-space/50 border-space-light text-white"
                              placeholder="City, Country"
                            />
                          </div>
                          <div>
                            <Label htmlFor="website" className="text-gray-300">Website</Label>
                            <Input 
                              id="website" 
                              type="url" 
                              value={websiteText}
                              onChange={(e) => setWebsiteText(e.target.value)}
                              className="bg-space/50 border-space-light text-white"
                              placeholder="https://your-website.com"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button onClick={handleSaveBio} className="bg-space-accent hover:bg-space-secondary">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="education" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white mb-4">Education</h3>
                    
                    {/* Education List */}
                    {education.length > 0 ? (
                      <div className="space-y-4">
                        {education.map((edu) => (
                          <Card key={edu.id} className="border border-space-light bg-space-light/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-white font-medium">{edu.institution}</h4>
                                  <p className="text-gray-400">{edu.degree} in {edu.field}</p>
                                  <p className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                                  </p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  onClick={() => dispatch(removeEducation(edu.id))}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No education added yet.</p>
                    )}
                    
                    {/* Add Education Form */}
                    <div className="pt-4">
                      <Card className="border border-space-light bg-space-light/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Add New Education</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="institution" className="text-gray-300">Institution</Label>
                            <Input 
                              id="institution" 
                              value={newEducation.institution}
                              onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                              className="bg-space/50 border-space-light text-white"
                              placeholder="University or School Name"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="degree" className="text-gray-300">Degree</Label>
                              <Input 
                                id="degree" 
                                value={newEducation.degree}
                                onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                                placeholder="Bachelor's, Master's, etc."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="field" className="text-gray-300">Field of Study</Label>
                              <Input 
                                id="field" 
                                value={newEducation.field}
                                onChange={(e) => setNewEducation({...newEducation, field: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                                placeholder="Computer Science, Physics, etc."
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                              <Input 
                                id="startDate" 
                                type="date" 
                                value={newEducation.startDate}
                                onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                              <Input 
                                id="endDate" 
                                type="date" 
                                disabled={newEducation.current}
                                value={newEducation.endDate}
                                onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="currentStudying"
                              checked={newEducation.current}
                              onChange={(e) => setNewEducation({...newEducation, current: e.target.checked, endDate: e.target.checked ? '' : newEducation.endDate})}
                              className="rounded border-gray-400"
                            />
                            <Label htmlFor="currentStudying" className="text-gray-300">I am currently studying here</Label>
                          </div>
                          
                          <Button onClick={handleAddEducation} className="w-full bg-space-accent hover:bg-space-secondary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Education
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white mb-4">Experience</h3>
                    
                    {/* Experience List */}
                    {experience.length > 0 ? (
                      <div className="space-y-4">
                        {experience.map((exp) => (
                          <Card key={exp.id} className="border border-space-light bg-space-light/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-white font-medium">{exp.position}</h4>
                                  <p className="text-gray-400">{exp.company}</p>
                                  <p className="text-sm text-gray-500">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                  </p>
                                  {exp.description && (
                                    <p className="text-gray-300 mt-2">{exp.description}</p>
                                  )}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  onClick={() => dispatch(removeExperience(exp.id))}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No experience added yet.</p>
                    )}
                    
                    {/* Add Experience Form */}
                    <div className="pt-4">
                      <Card className="border border-space-light bg-space-light/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Add New Experience</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="position" className="text-gray-300">Position</Label>
                              <Input 
                                id="position" 
                                value={newExperience.position}
                                onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                                placeholder="Job Title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company" className="text-gray-300">Company</Label>
                              <Input 
                                id="company" 
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                                placeholder="Company Name"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="workStartDate" className="text-gray-300">Start Date</Label>
                              <Input 
                                id="workStartDate" 
                                type="date" 
                                value={newExperience.startDate}
                                onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="workEndDate" className="text-gray-300">End Date</Label>
                              <Input 
                                id="workEndDate" 
                                type="date" 
                                disabled={newExperience.current}
                                value={newExperience.endDate}
                                onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-gray-300">Description</Label>
                            <textarea
                              id="description"
                              rows={3}
                              value={newExperience.description}
                              onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                              className="w-full rounded-md border border-space-light bg-space/50 text-white p-3"
                              placeholder="Describe your responsibilities and achievements..."
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="currentWork"
                              checked={newExperience.current}
                              onChange={(e) => setNewExperience({...newExperience, current: e.target.checked, endDate: e.target.checked ? '' : newExperience.endDate})}
                              className="rounded border-gray-400"
                            />
                            <Label htmlFor="currentWork" className="text-gray-300">I am currently working here</Label>
                          </div>
                          
                          <Button onClick={handleAddExperience} className="w-full bg-space-accent hover:bg-space-secondary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Experience
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white mb-4">Skills</h3>
                    
                    {/* Skills List */}
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <div 
                            key={skill.id}
                            className="flex items-center space-x-1 bg-space-light/30 text-white px-3 py-1.5 rounded-full"
                          >
                            <span>
                              {skill.name} 
                              <span className="ml-1 text-xs text-gray-400">({skill.proficiency})</span>
                            </span>
                            <button
                              onClick={() => dispatch(removeSkill(skill.id))}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No skills added yet.</p>
                    )}
                    
                    {/* Add Skill Form */}
                    <div className="pt-4">
                      <Card className="border border-space-light bg-space-light/20">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Add New Skill</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="skillName" className="text-gray-300">Skill Name</Label>
                              <Input 
                                id="skillName" 
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                                className="bg-space/50 border-space-light text-white"
                                placeholder="JavaScript, Project Management, etc."
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="proficiency" className="text-gray-300">Proficiency</Label>
                              <select
                                id="proficiency"
                                value={newSkill.proficiency}
                                onChange={(e) => setNewSkill({...newSkill, proficiency: e.target.value})}
                                className="w-full rounded-md border border-space-light bg-space/50 text-white p-2"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            </div>
                            
                            <Button onClick={handleAddSkill} className="bg-space-accent hover:bg-space-secondary">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Skill
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;