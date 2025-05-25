import React, { useState } from 'react';
import ShootingStars from '@/components/ShootingStars';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('weekly');
  const [cartItemCount] = useState(0);

  const leaderboardUsers = [
    {
      id: '1',
      name: 'Emma Thompson',
      avatar: 'https://i.pravatar.cc/100?img=1',
      points: 12500,
      rank: 1,
      level: 'Cosmic Explorer',
      courses: 15,
      streak: 42,
      badges: ['Course Creator', '30-Day Streak', 'Top Contributor']
    },
    {
      id: '2',
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/100?img=2',
      points: 11200,
      rank: 2,
      level: 'Starship Captain',
      courses: 12,
      streak: 36,
      badges: ['Question Master', 'Early Adopter']
    },
    {
      id: '3',
      name: 'Olivia Martinez',
      avatar: 'https://i.pravatar.cc/100?img=3',
      points: 10800,
      rank: 3,
      level: 'Nebula Navigator',
      courses: 14,
      streak: 29,
      badges: ['Community Helper', 'Problem Solver']
    },
    {
      id: '4',
      name: 'Daniel Johnson',
      avatar: 'https://i.pravatar.cc/100?img=4',
      points: 9600,
      rank: 4,
      level: 'Galaxy Guardian',
      courses: 10,
      streak: 24,
      badges: ['Quick Learner']
    },
    {
      id: '5',
      name: 'Sophia Garcia',
      avatar: 'https://i.pravatar.cc/100?img=5',
      points: 8900,
      rank: 5,
      level: 'Comet Chaser',
      courses: 9,
      streak: 18,
      badges: ['Consistent Learner']
    },
    {
      id: '6',
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/100?img=6',
      points: 8200,
      rank: 6,
      level: 'Star Voyager',
      courses: 8,
      streak: 14,
      badges: ['Rising Star']
    },
    {
      id: '7',
      name: 'Ava Davis',
      avatar: 'https://i.pravatar.cc/100?img=7',
      points: 7500,
      rank: 7,
      level: 'Moon Walker',
      courses: 7,
      streak: 12,
      badges: ['Dedicated Student']
    },
    {
      id: '8',
      name: 'Ethan Miller',
      avatar: 'https://i.pravatar.cc/100?img=8',
      points: 7100,
      rank: 8,
      level: 'Asteroid Adventurer',
      courses: 7,
      streak: 10,
      badges: ['Fast Finisher']
    },
    {
      id: '9',
      name: 'Isabella Wilson',
      avatar: 'https://i.pravatar.cc/100?img=9',
      points: 6800,
      rank: 9,
      level: 'Satellite Surfer',
      courses: 6,
      streak: 9,
      badges: ['Team Player']
    },
    {
      id: '10',
      name: 'Noah Taylor',
      avatar: 'https://i.pravatar.cc/100?img=10',
      points: 6500,
      rank: 10,
      level: 'Planet Pioneer',
      courses: 6,
      streak: 7,
      badges: ['Good Start']
    }
  ];

  const getTopThree = () => leaderboardUsers.slice(0, 3);
  const getRest = () => leaderboardUsers.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={cartItemCount} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Compete with fellow students to earn points and climb the ranks. Learn consistently to maintain your position.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <Tabs defaultValue="weekly" className="w-full max-w-md" onValueChange={setActiveTimeframe}>
            <TabsList className="grid grid-cols-3 w-full bg-space-light/30">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Top 3 Winners */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-end mb-16">
          {getTopThree().map((user, index) => {
            const position = index + 1;
            const scale = position === 1 ? 1.1 : 1;
            const height = position === 1 ? "h-40" : position === 2 ? "h-32" : "h-28";
            
            return (
              <motion.div
                key={user.id}
                className={`relative ${position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 md:w-24 md:h-24 ${position === 1 ? 'w-24 h-24 md:w-28 md:h-28' : ''} relative`}>
                    <Avatar className="w-full h-full border-4 border-space-accent">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center 
                      ${position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-300' : 'bg-amber-700'}`}>
                      <span className="text-lg font-bold">{position}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-medium mt-2 text-center">{user.name}</h3>
                  
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className={`
                      ${position === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                        position === 2 ? 'bg-gray-400/20 text-gray-300' : 
                        'bg-amber-700/20 text-amber-500'}
                    `}>
                      {user.level}
                    </Badge>
                  </div>
                  
                  <div className="text-space-accent font-bold text-xl mt-2">{user.points.toLocaleString()} pts</div>
                  
                  <motion.div 
                    className={`w-full ${height} bg-space-accent/20 rounded-t-lg mt-4 flex items-end justify-center overflow-hidden`}
                    initial={{ height: 0 }}
                    animate={{ height: height }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className={`w-full ${
                      position === 1 ? 'bg-yellow-500' : 
                      position === 2 ? 'bg-gray-300' : 
                      'bg-amber-700'} h-1/3`}>
                      <div className="text-black font-bold text-center py-2">#{position}</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Rest of Leaderboard */}
        <Card className="bg-space-light/30 border-space-light backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-space-light/50 border-b border-space-light">
            <CardTitle className="text-white">Leaderboard Rankings</CardTitle>
            <CardDescription className="text-gray-400">
              {activeTimeframe === 'weekly' ? 'This Week\'s' : 
               activeTimeframe === 'monthly' ? 'This Month\'s' : 
               'All-Time'} top performers
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <ul className="divide-y divide-space-light">
              {getRest().map((user, index) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center p-4 hover:bg-space-light/20 transition-colors"
                >
                  <div className="w-8 text-center font-semibold text-gray-400">
                    {user.rank}
                  </div>
                  
                  <Avatar className="ml-4 border-2 border-space-accent">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-white">{user.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-transparent border-gray-600 text-gray-400">
                        {user.level}
                      </Badge>
                      <span className="text-xs text-gray-400">{user.courses} courses</span>
                      <span className="text-xs text-gray-400">⚡ {user.streak} day streak</span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex space-x-1">
                    {user.badges.slice(0, 2).map((badge, i) => (
                      <Badge key={i} className="bg-space-accent/20 text-space-accent border-none">
                        {badge}
                      </Badge>
                    ))}
                    {user.badges.length > 2 && (
                      <Badge className="bg-space-accent/20 text-space-accent border-none">
                        +{user.badges.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-space-accent">{user.points.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
