import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const LeaderboardSection = ({ users }) => {
  return (
    <div className="bg-space py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Top Learners</h2>
          <p className="text-gray-400">
            Join our community of dedicated learners and compete for the top spots on our leaderboard. Earn points by completing courses, participating in discussions, and helping others.
          </p>
        </div>
        
        <Card className="bg-space-light/30 border-space-light backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-space-light/50 border-b border-space-light flex flex-row items-center justify-between">
            <h3 className="font-heading font-semibold text-xl text-white">This Week's Leaderboard</h3>
            <Link to="/leaderboard">
              <Button variant="link" className="text-space-accent hover:text-space-secondary">
                View Full Leaderboard
              </Button>
            </Link>
          </CardHeader>
          
          <CardContent className="p-0">
            <ul className="divide-y divide-space-light">
              {users.map((user, index) => (
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
                  
                  <div className="ml-4 relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-space-accent"
                    />
                    {user.rank <= 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {user.rank}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-white">{user.name}</p>
                    <Badge variant="outline" className="text-xs bg-transparent border-gray-600 text-gray-400">
                      {user.level}
                    </Badge>
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
      </div>
    </div>
  );
};

export default LeaderboardSection;
