import React, { useState } from 'react';
import ShootingStars from '@/components/ShootingStars';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, HelpCircle, MessageSquare } from 'lucide-react';

const AskDoubts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [cartItemCount] = useState(0);

  const questions = [
    {
      id: '1',
      title: 'How do I implement Redux with React Hooks?',
      content: 'I\'m trying to use Redux with React Hooks but I\'m not sure about the best practices. Should I use useReducer or the Redux toolkit?',
      author: {
        name: 'Emma Thompson',
        avatar: 'https://i.pravatar.cc/100?img=1',
        level: 'Advanced'
      },
      category: 'Web Development',
      tags: ['React', 'Redux', 'Hooks'],
      createdAt: '2025-05-01T10:24:00Z',
      replies: 3,
      views: 28,
      resolved: true
    },
    // ... (keep all other question objects the same)
  ];

  const categories = ['Web Development', 'Machine Learning', 'Database', 'Design', 'Mobile Development', 'DevOps', 'Computer Science'];
  
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || question.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const handleAskQuestion = (e) => {
    e.preventDefault();
    
    if (!questionTitle.trim() || !questionContent.trim() || !questionCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Question submitted",
      description: "Your question has been posted successfully!",
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
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Ask Doubts</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stuck on a problem? Ask the community for help or browse existing questions to find answers.
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-space-light/30">
              <TabsTrigger value="browse" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Browse Questions
              </TabsTrigger>
              <TabsTrigger value="ask" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Ask a Question
              </TabsTrigger>
              <TabsTrigger value="my-questions" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                My Questions
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Tabs content remains the same, just remove type annotations */}
          <TabsContent value="browse" className="mt-0">
            {/* ... (keep all JSX the same) ... */}
          </TabsContent>
          
          <TabsContent value="ask">
            {/* ... (keep all JSX the same) ... */}
          </TabsContent>
          
          <TabsContent value="my-questions">
            {/* ... (keep all JSX the same) ... */}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AskDoubts;