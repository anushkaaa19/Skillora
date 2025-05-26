import React, { useState } from 'react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Clock, Users, MessageSquare, BookOpen } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const StudyRoom = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('public');
  const [cartItemCount] = useState(0);

  const studyRooms = [
    {
      id: '1',
      name: 'JavaScript Advanced Concepts',
      subject: 'Web Development',
      participants: 8,
      maxParticipants: 10,
      isPrivate: false,
      status: 'active'
    },
    {
      id: '2',
      name: 'Machine Learning Study Group',
      subject: 'Data Science',
      participants: 12,
      maxParticipants: 15,
      isPrivate: false,
      status: 'active'
    },
    {
      id: '3',
      name: 'UI/UX Design Principles',
      subject: 'Design',
      participants: 6,
      maxParticipants: 8,
      isPrivate: true,
      status: 'active'
    },
    {
      id: '4',
      name: 'React & Redux Deep Dive',
      subject: 'Web Development',
      participants: 15,
      maxParticipants: 15,
      isPrivate: false,
      status: 'full'
    },
    {
      id: '5',
      name: 'Database Architecture',
      subject: 'Computer Science',
      participants: 0,
      maxParticipants: 12,
      isPrivate: false,
      status: 'scheduled',
      startTime: '2025-05-05T15:00:00Z'
    },
    {
      id: '6',
      name: 'Mobile App Development',
      subject: 'Mobile Development',
      participants: 9,
      maxParticipants: 12,
      isPrivate: false,
      status: 'active'
    }
  ];

  const filteredRooms = studyRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'public' && !room.isPrivate) || 
                      (activeTab === 'private' && room.isPrivate);
    
    return matchesSearch && matchesTab;
  });

  const handleJoinRoom = (room) => {
    if (room.status === 'full') {
      toast({
        title: "Room is full",
        description: "This study room has reached its maximum capacity.",
        variant: "destructive"
      });
      return;
    }
    
    if (room.status === 'scheduled') {
      toast({
        title: "Room not started yet",
        description: "This study room is scheduled for later. You can join when it starts.",
        variant: "destructive"
      });
      return;
    }
    
    if (room.isPrivate) {
      // In a real app, show a dialog to enter password
      toast({
        title: "Private Room",
        description: "This study room requires a password to join.",
      });
      return;
    }
    
    toast({
      title: "Joined study room",
      description: `You have joined "${room.name}" successfully.`,
    });
  };

  const createNewRoom = () => {
    toast({
      title: "Create a new study room",
      description: "This would open a dialog to create a new study room in a real app.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={cartItemCount} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Study Rooms</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join virtual study rooms to collaborate with fellow students, share resources, and help each other understand complex topics.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <Tabs defaultValue="public" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full md:w-[400px] bg-space-light/30">
                <TabsTrigger value="public">Public Rooms</TabsTrigger>
                <TabsTrigger value="private">Private Rooms</TabsTrigger>
                <TabsTrigger value="all">All Rooms</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <Input
              type="text"
              placeholder="Search rooms..."
              className="bg-space-light/30 border-space-light text-white max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              className="bg-space-accent hover:bg-space-secondary text-white whitespace-nowrap"
              onClick={createNewRoom}
            >
              Create Room
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="bg-space-light/30 border-space-light backdrop-blur-sm overflow-hidden hover:shadow-lg hover:shadow-space-accent/10 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-xl">{room.name}</CardTitle>
                  {room.status === 'active' ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : room.status === 'full' ? (
                    <Badge className="bg-yellow-500">Full</Badge>
                  ) : (
                    <Badge className="bg-blue-500">Scheduled</Badge>
                  )}
                </div>
                <CardDescription className="text-gray-400">Subject: {room.subject}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Users size={16} />
                    <span>{room.participants}/{room.maxParticipants} participants</span>
                  </div>
                  
                  {room.isPrivate && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <span>🔒 Private</span>
                    </div>
                  )}
                  
                  {room.status === 'scheduled' && room.startTime && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock size={16} />
                      <span>Starts: {new Date(room.startTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="bg-transparent border-space-accent/50 text-space-accent">
                    <BookOpen size={14} className="mr-1" />
                    Study
                  </Badge>
                  <Badge variant="outline" className="bg-transparent border-space-accent/50 text-space-accent">
                    <MessageSquare size={14} className="mr-1" />
                    Chat
                  </Badge>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full bg-space-accent hover:bg-space-secondary text-white"
                  variant={room.status !== 'active' ? "outline" : "default"}
                  disabled={room.status === 'full'}
                  onClick={() => handleJoinRoom(room)}
                >
                  {room.status === 'active' && !room.isPrivate ? "Join Now" : 
                   room.status === 'active' && room.isPrivate ? "Enter Password" :
                   room.status === 'full' ? "Room Full" : "Join When Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl text-white mb-2">No study rooms found</h3>
            <p className="text-gray-400">Try adjusting your search or create a new study room.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyRoom;
