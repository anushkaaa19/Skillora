import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, Filter } from 'lucide-react';
import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToCart } from '../redux/slices/cartSlice';
import { setCourses } from '../redux/slices/courseSlice';
import { toast } from '../hooks/use-toast';

// Sample course data
const sampleCourses = [
  {
    id: "1",
    title: "Introduction to Astronomy: Exploring Our Universe",
    instructor: "Dr. Sarah Thompson",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNwYWNlfGVufDB8fDB8fHww",
    price: 49.99,
    rating: 4.7,
    duration: "6 weeks",
    level: "Beginner",
    category: "Astronomy"
  },
  {
    id: "2",
    title: "Advanced Astrophysics: Black Holes & Dark Matter",
    instructor: "Prof. Michael Chen",
    image: "https://images.unsplash.com/photo-1501862700950-18382cd41497?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNwYWNlfGVufDB8fDB8fHww",
    price: 79.99,
    rating: 4.9,
    duration: "10 weeks",
    level: "Advanced",
    category: "Astrophysics"
  },
  {
    id: "3",
    title: "Rocket Science Fundamentals",
    instructor: "Dr. Robert Oppenheimer",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJvY2tldHxlbnwwfHwwfHx8MA%3D%3D",
    price: 59.99,
    rating: 4.5,
    duration: "8 weeks",
    level: "Intermediate",
    category: "Engineering"
  },
  {
    id: "4",
    title: "Introduction to Space Law",
    instructor: "Jennifer Lawrence, J.D.",
    image: "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhd3xlbnwwfHwwfHx8MA%3D%3D",
    price: 39.99,
    rating: 4.2,
    duration: "4 weeks",
    level: "Beginner",
    category: "Law"
  },
  {
    id: "5",
    title: "Space Medicine: Human Health in Microgravity",
    instructor: "Dr. Elena Kuznetsova",
    image: "https://plus.unsplash.com/premium_photo-1661769336629-bc18f1b51327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    price: 69.99,
    rating: 4.8,
    duration: "6 weeks",
    level: "Advanced",
    category: "Medicine"
  },
  {
    id: "6",
    title: "Space Station Design & Engineering",
    instructor: "Prof. James Wong",
    image: "https://images.unsplash.com/photo-1541185934-01b600ea069c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BhY2UlMjBzdGF0aW9ufGVufDB8fDB8fHww",
    price: 89.99,
    rating: 4.6,
    duration: "12 weeks",
    level: "Advanced",
    category: "Engineering"
  }
];

const categories = ["All", "Astronomy", "Astrophysics", "Engineering", "Law", "Medicine"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);

  useEffect(() => {
    // In a real app, this would be an API call
    dispatch(setCourses(sampleCourses));
  }, [dispatch]);
  
  const courses = useAppSelector(state => state.courses.courses);
  
  useEffect(() => {
    let results = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      results = results.filter(course => course.category === selectedCategory);
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      results = results.filter(course => selectedLevels.includes(course.level));
    }
    
    // Apply price range filter
    results = results.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default: // popularity
        // For demo, we'll just keep the original order
        break;
    }
    
    setFilteredCourses(results);
  }, [searchTerm, selectedCategory, selectedLevels, priceRange, sortBy, courses]);

  const handleAddToCart = (course) => {
    const isAlreadyInCart = items.some(item => item.id === course.id);
    if (isAlreadyInCart) {
      toast({
        title: "Already in cart",
        description: "This course is already in your shopping cart",
      });
      return;
    }
    
    dispatch(addToCart(course));
    toast({
      title: "Course added to cart",
      description: `${course.title} has been added to your cart`,
    });
  };

  const handleLevelToggle = (level) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={items.length} />
      
      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Explore Courses</h1>
          <p className="text-gray-400">
            Discover a universe of knowledge with our expert-led courses
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters section - for larger screens */}
          <div className="hidden lg:block w-64 space-y-8">
            <div className="bg-space-light/30 backdrop-blur-sm border border-space-light rounded-lg p-5">
              <h3 className="text-white font-semibold mb-4">Filters</h3>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">Category</h4>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-space-light/50 border-space-light text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">Level</h4>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`level-${level}`} 
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => handleLevelToggle(level)}
                          className="border-space-accent text-space-accent"
                        />
                        <label 
                          htmlFor={`level-${level}`}
                          className="text-sm text-gray-300"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <h4 className="text-gray-300 font-medium">Price Range</h4>
                    <span className="text-sm text-gray-400">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-space-light text-white hover:bg-space-light"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedLevels([]);
                    setPriceRange([0, 100]);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow">
            {/* Search and sort bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search courses..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-space-light/50 border-space-light text-white"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-space-light/50 border-space-light text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Mobile filter button */}
              <Button 
                variant="outline" 
                className="lg:hidden w-full sm:w-auto border-space-light text-white"
              >
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>
            
            {/* Applied filters */}
            {(selectedCategory !== "All" || selectedLevels.length > 0 || searchTerm) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "All" && (
                  <Badge className="bg-space-accent/20 text-space-accent hover:bg-space-accent/30">
                    {selectedCategory}
                    <button 
                      className="ml-2 hover:text-white"
                      onClick={() => setSelectedCategory("All")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {selectedLevels.map(level => (
                  <Badge 
                    key={level} 
                    className="bg-space-accent/20 text-space-accent hover:bg-space-accent/30"
                  >
                    {level}
                    <button 
                      className="ml-2 hover:text-white"
                      onClick={() => handleLevelToggle(level)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                {searchTerm && (
                  <Badge className="bg-space-accent/20 text-space-accent hover:bg-space-accent/30">
                    Search: {searchTerm}
                    <button 
                      className="ml-2 hover:text-white"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
            
            {/* Course tabs */}
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-space-light/30 border border-space-light">
                <TabsTrigger value="all" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                  All Courses
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                  Most Popular
                </TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
                  New Releases
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                    <p className="text-gray-400">Try adjusting your filters to find what you're looking for</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onAddToCart={handleAddToCart} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Filter to show only high-rated courses */}
                  {filteredCourses
                    .filter(course => course.rating >= 4.5)
                    .map(course => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onAddToCart={handleAddToCart} 
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="new" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* For demo, just show the first 3 courses as "new" */}
                  {filteredCourses
                    .slice(0, 3)
                    .map(course => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onAddToCart={handleAddToCart} 
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Pagination placeholder */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" className="w-10 h-10 border-space-light text-white">
                  1
                </Button>
                <Button variant="outline" size="icon" className="w-10 h-10 border-space-light text-white">
                  2
                </Button>
                <Button variant="outline" size="icon" className="w-10 h-10 border-space-light text-white">
                  3
                </Button>
                <Button variant="outline" size="icon" disabled className="w-10 h-10 border-space-light text-white">
                  ...
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;