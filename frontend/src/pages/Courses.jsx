import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, Filter } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import ShootingStars from '../components/ShootingStars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useCartStore } from '../redux/slices/cartSlice';
import { useCourseStore } from '../redux/slices/courseSlice';
import { toast } from '../hooks/use-toast';
import { useAuthStore } from '../redux/slices/authSlice';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthStore();
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const courses = useCourseStore(state => state.courses);
  const setCourses = useCourseStore(state => state.setCourses);
  const items = useCartStore(state => state.items);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/course/showAllCategories`);
        const json = await res.json();
        if (json.success) {
          const names = [...new Set(json.data.map(c => c.name))]; // ✅ De-duplicate
          setCategories(["All", ...names]);
        } else {
          toast({ title: "Error", description: json.message });
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch categories" });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/course/getAllCourses`);
        const json = await res.json();
        if (json.success) {
          setCourses(json.data);
        } else {
          toast({ title: "Error", description: json.message });
        }
      } catch (error) {
        toast({ title: "Error", description: "Could not load courses" });
      }
    };

    fetchCourses();
  }, [setCourses]);

  useEffect(() => {
    let results = [...courses];

    if (searchTerm) {
      results = results.filter(course => {
        const instructorName = course.instructor
          ? `${course.instructor.firstName ?? ""} ${course.instructor.lastName ?? ""}`.toLowerCase()
          : "";
        const categoryName = course.category?.name?.toLowerCase() ?? "";

        return (
          course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructorName.includes(searchTerm.toLowerCase()) ||
          categoryName.includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedCategory !== "All") {
      results = results.filter(course => course.category?.name === selectedCategory);
    }

    results = results.filter(course =>
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        break;
    }

    setFilteredCourses(results);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, sortBy, courses]);

  const paginatedCourses = filteredCourses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddToCart = (course) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to add courses to your cart.",
        variant: "destructive",
      });
      return;
    }
  
    const isAlreadyInCart = items.some(item => item._id === course._id);
    if (isAlreadyInCart) {
      toast({
        title: "Already in cart",
        description: "This course is already in your cart.",
      });
      navigate("/cart"); // 👈 still take them to cart
      return;
    }
  
    addToCart(course);
  
    toast({
      title: "Course added",
      description: `${course.courseName} has been added to your cart.`,
    });
  
    navigate("/cart"); // ✅ redirect after add
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={items.length} />

      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Explore Courses</h1>
          <p className="text-gray-400">Discover a universe of knowledge with our expert-led courses</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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
                      {categories.map((category, index) => (
                        <SelectItem key={`${category}-${index}`} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <h4 className="text-gray-300 font-medium">Price Range</h4>
                    <span className="text-sm text-gray-400">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full border-space-light text-white hover:bg-space-light"
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 1000]);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-grow">
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

              <Button variant="outline" className="lg:hidden w-full sm:w-auto border-space-light text-white">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>

            {(selectedCategory !== "All" || searchTerm) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "All" && (
                  <Badge className="bg-space-accent/20 text-space-accent hover:bg-space-accent/30">
                    {selectedCategory}
                    <button className="ml-2 hover:text-white" onClick={() => setSelectedCategory("All")}>×</button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge className="bg-space-accent/20 text-space-accent hover:bg-space-accent/30">
                    Search: {searchTerm}
                    <button className="ml-2 hover:text-white" onClick={() => setSearchTerm("")}>×</button>
                  </Badge>
                )}
              </div>
            )}

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
                    {paginatedCourses.map(course => (
                      <CourseCard key={course._id} course={course} onAddToCart={handleAddToCart} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses
                    .filter(course => course.rating >= 4.5)
                    .map(course => (
                      <CourseCard key={course._id} course={course} onAddToCart={handleAddToCart} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.slice(0, 3).map(course => (
                    <CourseCard key={course._id} course={course} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {filteredCourses.length > pageSize && (
              <div className="flex justify-center mt-8 space-x-1">
                {[...Array(Math.ceil(filteredCourses.length / pageSize))].map((_, i) => (
                  <Button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    variant="outline"
                    size="icon"
                    className={`w-10 h-10 border-space-light text-white ${currentPage === i + 1 ? 'bg-space-accent' : ''}`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
