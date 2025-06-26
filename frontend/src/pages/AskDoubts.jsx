// Full AskDoubts.jsx with View/Reply functionality for each question
import React, { useEffect, useState } from 'react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../redux/slices/authSlice';
import { useToast } from '../hooks/use-toast';

import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '../components/ui/tabs';
import {
  Avatar, AvatarFallback, AvatarImage
} from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '../components/ui/select';
import { MessageSquare, HelpCircle } from 'lucide-react';

const AskDoubts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const { user, isAuthenticated } = useAuthStore();
  const token = localStorage.getItem("token");

  const fetchQuestions = async () => {
    if (!user?.courses?.length) return;
    const all = [];
    for (const course of user.courses) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/questions/${course._id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) all.push(...data.data);
      } catch (err) {
        console.error(`❌ Failed to fetch questions for course ${course._id}`, err);
      }
    }
    setQuestions(all);
  };

  useEffect(() => { if (isAuthenticated) fetchQuestions(); }, [isAuthenticated, user]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/course/showAllCategories`);
        const data = await res.json();
        if (data.success) {
          const uniqueNames = [...new Set(data.data.map(c => c.name))];
          setCategories(uniqueNames);
        }
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    })();
  }, []);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !questionTitle || !questionContent || !questionCategory) {
      return toast({ title: "All fields are required.", description: "Please complete the form.", variant: "destructive" });
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/questions/${selectedCourseId}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: questionTitle, content: questionContent, category: questionCategory }),
      });
      const json = await res.json();
      if (json.success) {
        toast({ title: "Question submitted!" });
        setQuestionTitle(''); setQuestionContent(''); setQuestionCategory(''); setSelectedCourseId('');
        setActiveTab('browse'); setQuestions(prev => [json.data, ...prev]);
      } else {
        toast({ title: "Failed to post question", description: json.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Server Error", description: "Could not submit your question.", variant: "destructive" });
    }
  };

  const handleReply = async (questionId) => {
    const content = replyInputs[questionId];
    if (!content) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/questions/reply/${questionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Reply added!" });
        setQuestions(prev =>
          prev.map(q => q._id === questionId ? { ...q, replies: [...(q.replies || []), data.data] } : q)
        );
        setReplyInputs(prev => ({ ...prev, [questionId]: '' }));
      } else {
        toast({ title: "Failed to reply", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not send reply.", variant: "destructive" });
    }
  };

  const filteredQuestions = questions.filter(q =>
    (q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (category === 'all' || q.category === category)
  );

  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("en-US", {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateStr));

  const uniqueCourses = user?.courses?.filter((course, i, self) => i === self.findIndex(c => c._id === course._id)) || [];

  if (!isAuthenticated)
    return <p className="text-center text-yellow-400 mt-20">⚠️ Please log in to view or ask doubts.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={0} />
      <main className="container mx-auto px-4 py-10 text-white flex-grow">
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse"><MessageSquare className="mr-2 h-4 w-4" /> Browse Questions</TabsTrigger>
            <TabsTrigger value="ask"><HelpCircle className="mr-2 h-4 w-4" /> Ask a Question</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Input placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="sm:flex-1 bg-space-light/50 border border-space-light text-white" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-space-light/50 border border-space-light text-white sm:w-64">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat, i) => <SelectItem key={`cat-${i}`} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {filteredQuestions.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No questions found.</p>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map(q => (
                  <Card key={q._id} className="bg-space-light/30 border border-space-light text-white">
                    <CardHeader>
                      <CardTitle>{q.title}</CardTitle>
                      <CardDescription>{q.category}</CardDescription>
                    </CardHeader>
                    <CardContent><p>{q.content}</p></CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar><AvatarImage src={q.author?.avatar} /><AvatarFallback>{q.author?.name?.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                          <p className="text-sm font-medium">{q.author?.name}</p>
                          <p className="text-xs text-gray-400">{q.author?.level || 'Student'}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400 items-center">
                        <span>{formatDate(q.createdAt)}</span>
                        <span>{q.replies?.length || 0} replies</span>
                        <Button size="sm" variant="ghost" onClick={() => setShowReplies(p => ({ ...p, [q._id]: !p[q._id] }))}>Replies</Button>
                      </div>
                    </CardFooter>
                    {showReplies[q._id] && (
                      <CardContent className="space-y-4">
                        {(q.replies || []).map((r, i) => (
                          <div key={i} className="flex gap-2 text-sm text-gray-300">
                            <Avatar className="h-6 w-6"><AvatarImage src={r.user?.image} /><AvatarFallback>{r.user?.firstName?.charAt(0)}</AvatarFallback></Avatar>
                            <div><p className="font-semibold">{r.user?.firstName || "Anonymous"}</p><p>{r.content}</p></div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input value={replyInputs[q._id] || ''} onChange={(e) => setReplyInputs(prev => ({ ...prev, [q._id]: e.target.value }))} placeholder="Write a reply..." className="bg-space-light/40 border border-space-light text-white" />
                          <Button size="sm" onClick={() => handleReply(q._id)} className="bg-space-accent">Send</Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ask">
            <form onSubmit={handleAskQuestion} className="space-y-6 max-w-2xl mx-auto mt-8">
              <Input placeholder="Question Title" value={questionTitle} onChange={(e) => setQuestionTitle(e.target.value)} className="bg-space-light/50 border border-space-light text-white" />
              <Textarea placeholder="Describe your question..." value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} className="bg-space-light/50 border border-space-light text-white" />
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="bg-space-light/50 border border-space-light text-white"><SelectValue placeholder="Select a course" /></SelectTrigger>
                <SelectContent>{uniqueCourses.map((course, i) => <SelectItem key={i} value={course._id}>{course.courseName}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={questionCategory} onValueChange={setQuestionCategory}>
                <SelectTrigger className="bg-space-light/50 border border-space-light text-white"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>{categories.map((cat, i) => <SelectItem key={i} value={cat}>{cat}</SelectItem>)}</SelectContent>
              </Select>
              <Button type="submit" className="w-full bg-space-accent text-white hover:bg-space-accent/90">Submit Question</Button>
            </form>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AskDoubts;
