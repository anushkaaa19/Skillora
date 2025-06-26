// Profile.jsx
// Required: npm install axios react-datepicker
// Backend: Expects /updateUserProfileImage and /updateProfile endpoints

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuthStore } from '../redux/slices/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShootingStars from '../components/ShootingStars';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Trash, Save, Mail } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuthStore();

  const [profileData, setProfileData] = useState({
    about: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [userImage, setUserImage] = useState('');

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/profile/getUserDetails`, {
        withCredentials: true,
      });
      const userRes = res.data.data;
      const data = userRes.additionalDetails;
      setProfileData({
        about: data.about || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : '',
        contactNumber: data.contactNumber || '',
      });
      setUserImage(userRes.image);
    } catch (err) {
      console.error('Error loading profile', err);
    }
  };

  const saveProfile = async () => {
    try {
      const formattedDOB = profileData.dateOfBirth instanceof Date
        ? profileData.dateOfBirth.toISOString().split('T')[0]
        : profileData.dateOfBirth; // fallback if already string
  
      await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/profile/updateProfile`,
        {
          ...profileData,
          dateOfBirth: formattedDOB,
        },
        { withCredentials: true }
      );
      setEditMode(false);
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  };
  

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/v1/profile/deleteProfile`, {
        withCredentials: true,
      });
      logout();
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/profile/updateUserProfileImage`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      alert('Profile image updated');
      setUserImage(res.data.data.image);
    } catch (error) {
      console.error('Image update failed', error);
      alert('Failed to update image');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar />

      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div>
            <Card className="bg-space-light/30 border border-space-light text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-space-accent">
                    {userImage ? (
                      <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-space-accent w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  {editMode && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full mt-2 text-sm text-white"
                    />
                  )}
                  <h3 className="mt-4 text-xl">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-gray-400">{user?.accountType}</p>
                </div>
                <Separator className="my-4 bg-space-light" />
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail size={16} /> {user?.email}
                </div>
                <Separator className="my-4 bg-space-light" />
                <Button variant="destructive" onClick={handleDelete} className="w-full">
                  <Trash className="mr-2" /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Info Form */}
          <div className="md:col-span-2">
            <Card className="bg-space-light/30 border border-space-light">
              <CardHeader>
                <CardTitle className="text-white flex justify-between">
                  Profile Info
                  <Button onClick={() => setEditMode(prev => !prev)} variant="outline">
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div>
                  <Label>About</Label>
                  <textarea
                    className="w-full bg-space p-2 border border-space-light rounded"
                    rows={4}
                    disabled={!editMode}
                    value={profileData.about}
                    onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    {editMode ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        className="w-full bg-space p-2 border border-space-light rounded text-white"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <Input value={profileData.gender} disabled />
                    )}
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    {editMode ? (
                      <DatePicker
                        selected={profileData.dateOfBirth}
                        onChange={(date) => setProfileData({ ...profileData, dateOfBirth: date })}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select date"
                        className="w-full bg-space p-2 border border-space-light rounded text-white"
                        calendarClassName="bg-space text-white"
                        popperPlacement="bottom"
                      />
                    ) : (
                      <Input
                        type="text"
                        value={
                          profileData.dateOfBirth
                            ? new Date(profileData.dateOfBirth).toLocaleDateString('en-CA')
                            : ''
                        }
                        disabled
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label>Contact Number</Label>
                  <Input
                    value={profileData.contactNumber}
                    disabled={!editMode}
                    onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                  />
                </div>

                {editMode && (
                  <Button onClick={saveProfile} className="bg-space-accent text-white">
                    <Save className="mr-2" /> Save Changes
                  </Button>
                )}
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
