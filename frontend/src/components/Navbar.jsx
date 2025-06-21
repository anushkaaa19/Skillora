import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { Badge } from "../components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { useAuthStore } from '../redux/slices/authSlice';
import { useCartStore } from "../redux/slices/cartSlice"; // if you use zustand cart

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  console.log("👤 Logged-in user:", user);

  const items = useCartStore((state) => state.items); // from zustand
  const cartCount = items.length;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-space/90 backdrop-blur-md border-b border-space-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-space-accent to-space-secondary flex items-center justify-center">
                <span className="font-heading text-white font-bold text-xl">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">Skillora</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/courses" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Courses
              </Link>
           
              <Link to="/leaderboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Leaderboard
              </Link>
              <Link to="/doubts" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Ask Doubts
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/cart" className="relative text-white">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            )}

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      {user.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-space-accent text-white">
  {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
</AvatarFallback>

                      
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-space-light/90 backdrop-blur-md border-space-light">
                <DropdownMenuLabel className="text-white">
  {`${user.firstName} ${user.lastName}`}
</DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-space-light" />
                  <DropdownMenuItem onClick={() => navigate(user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-space-light" />
                  <DropdownMenuItem className="text-red-400" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
  <User className="mr-2 h-4 w-4" />
  <span>Profile</span>
</DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-space-accent text-white hover:bg-space-secondary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-space-light">
              <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/courses" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Courses</Link>
              <Link to="/study-room" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Study Room</Link>
              <Link to="/leaderboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Leaderboard</Link>
              <Link to="/doubts" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Ask Doubts</Link>

              {isAuthenticated && (
                <Link to="/cart" className="text-gray-300 hover:text-white flex items-center px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              )}

              {isAuthenticated && user ? (
                <>
                  <Link to={user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button className="text-red-400 hover:text-red-300 flex items-center px-3 py-2 rounded-md text-base font-medium w-full" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    <LogOut className="h-5 w-5 mr-2" />
                    Log Out
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col space-y-2">
                  <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-space-accent text-white hover:bg-space-secondary">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


export default Navbar;

