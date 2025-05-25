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
    {
      id: '2',
      title: 'Understanding gradient descent in neural networks',
      content: 'I\'m having trouble understanding how gradient descent works in neural networks. Can someone explain it in simple terms?',
      author: {
        name: 'James Wilson',
        avatar: 'https://i.pravatar.cc/100?img=2',
        level: 'Intermediate'
      },
      category: 'Machine Learning',
      tags: ['Neural Networks', 'Gradient Descent', 'AI'],
      createdAt: '2025-05-01T15:42:00Z',
      replies: 5,
      views: 42,
      resolved: false
    },
    {
      id: '3',
      title: 'Best practices for responsive web design in 2025',
      content: 'What are the current best practices for responsive web design? Are media queries still relevant or should I be using something else?',
      author: {
        name: 'Olivia Martinez',
        avatar: 'https://i.pravatar.cc/100?img=3',
        level: 'Advanced'
      },
      category: 'Web Development',
      tags: ['CSS', 'Responsive Design', 'Mobile'],
      createdAt: '2025-05-01T18:15:00Z',
      replies: 2,
      views: 19,
      resolved: false
    },
    {
      id: '4',
      title: 'How to optimize PostgreSQL queries for large datasets?',
      content: 'I\'m working with a database that has millions of records and my queries are getting slow. What techniques can I use to optimize them?',
      author: {
        name: 'Daniel Johnson',
        avatar: 'https://i.pravatar.cc/100?img=4',
        level: 'Advanced'
      },
      category: 'Database',
      tags: ['PostgreSQL', 'Performance', 'SQL'],
      createdAt: '2025-05-02T09:30:00Z',
      replies: 4,
      views: 31,
      resolved: true
    },
    {
      id: '5',
      title: 'Understanding closures in JavaScript',
      content: 'Can someone explain how closures work in JavaScript? I keep seeing them used but I don\'t fully understand the concept.',
      author: {
        name: 'Sophia Garcia',
        avatar: 'https://i.pravatar.cc/100?img=5',
        level: 'Beginner'
      },
      category: 'Web Development',
      tags: ['JavaScript', 'Functions', 'Fundamentals'],
      createdAt: '2025-05-02T11:45:00Z',
      replies: 7,
      views: 53,
      resolved: true
    },
    {
      id: '6',
      title: 'Best way to implement authentication in a React app',
      content: 'I\'m building a React application and I need to implement authentication. What\'s the best approach for this in 2025?',
      author: {
        name: 'Michael Brown',
        avatar: 'https://i.pravatar.cc/100?img=6',
        level: 'Intermediate'
      },
      category: 'Web Development',
      tags: ['React', 'Authentication', 'Security'],
      createdAt: '2025-05-02T14:20:00Z',
      replies: 2,
      views: 26,
      resolved: false
    }
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
      {/* All other JSX remains unchanged */}
      {/* ... You already pasted the full component above ... */}
      <Footer />
    </div>
  );
};

export default AskDoubts;
