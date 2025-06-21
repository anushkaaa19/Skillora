import React, { useState } from 'react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { MessageSquare, HelpCircle } from 'lucide-react';

const AskDoubts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [cartItemCount] = useState(0);

  const categories = ['Web Development', 'Machine Learning', 'Database', 'Design', 'Mobile Development', 'DevOps', 'Computer Science'];

  const questions = [
    {
      id: '1',
      title: 'How do I implement Redux with React Hooks?',
      content: 'I\'m trying to use Redux with React Hooks but I\'m not sure about the best practices.',
      author: { name: 'Emma Thompson', avatar: 'https://i.pravatar.cc/100?img=1', level: 'Advanced' },
      category: 'Web Development',
      tags: ['React', 'Redux'],
      createdAt: '2025-05-01T10:24:00Z',
      replies: 3,
      views: 28,
      resolved: true
    },
    {
      id: '2',
      title: 'Understanding gradient descent in neural networks',
      content: 'I\'m having trouble understanding how gradient descent works in neural networks.',
      author: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/100?img=2', level: 'Intermediate' },
      category: 'Machine Learning',
      tags: ['Neural Networks', 'Gradient Descent'],
      createdAt: '2025-05-01T15:42:00Z',
      replies: 5,
      views: 42,
      resolved: false
    },
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || q.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionContent.trim() || !questionCategory) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Question Submitted",
      description: "Your question has been posted!",
    });
    setQuestionTitle('');
    setQuestionContent('');
    setQuestionCategory('');
    setActiveTab('browse');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={cartItemCount} />

      <main className="container mx-auto px-4 py-10 text-white flex-grow">
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse">
              <MessageSquare className="mr-2 h-4 w-4" />
              Browse Questions
            </TabsTrigger>
            <TabsTrigger value="ask">
              <HelpCircle className="mr-2 h-4 w-4" />
              Ask a Question
            </TabsTrigger>
          </TabsList>

          {/* BROWSE QUESTIONS TAB */}
          <TabsContent value="browse">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:flex-1 bg-space-light/50 border border-space-light text-white"
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-space-light/50 border border-space-light text-white sm:w-64">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredQuestions.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No questions found.</p>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map(q => (
                  <Card key={q.id} className="bg-space-light/30 border border-space-light text-white">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{q.title}</CardTitle>
                      <CardDescription className="text-gray-400">{q.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{q.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={q.author.avatar} />
                          <AvatarFallback>{q.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{q.author.name}</p>
                          <p className="text-xs text-gray-400">{q.author.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{formatDate(q.createdAt)}</span>
                        <span>{q.views} views</span>
                        <span>{q.replies} replies</span>
                        {q.resolved && <Badge className="bg-green-600 text-white">Resolved</Badge>}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ASK QUESTION TAB */}
          <TabsContent value="ask">
            <form onSubmit={handleAskQuestion} className="space-y-6 max-w-2xl mx-auto mt-8">
              <Input
                placeholder="Question Title"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                className="bg-space-light/50 border border-space-light text-white"
              />
              <Textarea
                placeholder="Describe your question in detail..."
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                className="bg-space-light/50 border border-space-light text-white"
              />
              <Select value={questionCategory} onValueChange={setQuestionCategory}>
                <SelectTrigger className="bg-space-light/50 border border-space-light text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full bg-space-accent text-white hover:bg-space-accent/90">
                Submit Question
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AskDoubts;
