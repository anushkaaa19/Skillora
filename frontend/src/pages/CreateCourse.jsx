import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShootingStars from '../components/ShootingStars';
import Footer from '../components/Footer';
import {
  Card, CardHeader, CardContent, CardTitle
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '../components/ui/select';
import { Upload, PlusCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [form, setForm] = useState({
    courseName: '',
    courseDescription: '',
    whatYouWillLearn: '',
    price: '',
    category: '',
    instructions: [],
    tag: [],
    thumbnailFile: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [instrInput, setInstrInput] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1/course/showAllCategories`)
      .then(res => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  const onFileChange = e => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, thumbnailFile: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm(f => ({ ...f, tag: [...f.tag, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const addInstr = () => {
    if (instrInput.trim()) {
      setForm(f => ({ ...f, instructions: [...f.instructions, instrInput.trim()] }));
      setInstrInput('');
    }
  };
  const saveNewCategory = async () => {
    try {
      const token = localStorage.getItem("auth-storage")
        ? JSON.parse(localStorage.getItem("auth-storage"))?.state?.user?.token
        : null;
  
      if (!token) {
        toast({ title: "No token found, please login again", variant: "destructive" });
        return;
      }
  
      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/createCategory`,
        {
          name: newCat,
          description: newCat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // if your backend also checks cookies (optional)
        }
      );
  
      toast({ title: "Category added!" });
      setNewCat("");
  
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/course/showAllCategories`);
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error creating course", variant: "destructive" });
    }
  };
  

  const handleSubmit = async e => {
    e.preventDefault();
    const { courseName, courseDescription, whatYouWillLearn, price, category, instructions, tag, thumbnailFile } = form;
    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !instructions.length || !tag.length || !thumbnailFile) {
      return toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
    }
    const data = new FormData();
    data.append('courseName', courseName);
    data.append('courseDescription', courseDescription);
    data.append('whatYouWillLearn', whatYouWillLearn);
    data.append('price', price);
    data.append('category', category);
    data.append('instructions', JSON.stringify(instructions));
    data.append('tag', JSON.stringify(tag));
    data.append('thumbnailImage', thumbnailFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/course/createCourse`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      toast({ title: 'Course created!' });
      navigate(`/instructor/course-builder/${res.data.data._id}`);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Could not create course',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar />

      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold text-white mb-6">Create New Course</h1>
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <Card className="bg-space-light/30 border border-space-light backdrop-blur-sm">
            <CardHeader><CardTitle className="text-white">Course Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">

              <div>
                <Label>Title</Label>
                <Input value={form.courseName} onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))} required />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={form.courseDescription} onChange={e => setForm(f => ({ ...f, courseDescription: e.target.value }))} required />
              </div>

              <div>
                <Label>What You'll Learn</Label>
                <Textarea value={form.whatYouWillLearn} onChange={e => setForm(f => ({ ...f, whatYouWillLearn: e.target.value }))} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <Label>Select Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger className="bg-space-light/50 border-space-light text-white">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add category..."
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                  className="bg-space-light/20 text-white"
                />
                <Button type="button" onClick={saveNewCategory} variant="outline">
                  <PlusCircle className="mr-2" /> Add Category
                </Button>
              </div>

              <div>
                <Label>Thumbnail</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => document.getElementById('thumb-input').click()}>
                    <Upload className="mr-2" /> Choose Image
                  </Button>
                  <input id="thumb-input" type="file" accept="image/*" hidden onChange={onFileChange} />
                  {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="w-32 h-20 object-cover rounded" />}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Enter tag" />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tag.map((t,i) => (
                    <span key={i} className="px-2 py-1 bg-space-light/50 rounded text-white">{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Instructions</Label>
                <div className="flex gap-2">
                  <Input value={instrInput} onChange={e => setInstrInput(e.target.value)} placeholder="Enter instruction" />
                  <Button onClick={addInstr}>Add</Button>
                </div>
                <ul className="list-disc ml-5 mt-2 text-white">
                  {form.instructions.map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
              </div>

            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-space-accent">
              Save & Continue
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCourse;
