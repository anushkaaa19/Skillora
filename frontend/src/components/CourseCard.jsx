import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { StarIcon, Clock, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onAddToCart }) => {
  const { id, title, instructor, image, price, rating, duration, level, category } = course;

  const levelColors = {
    'Beginner': 'bg-green-500',
    'Intermediate': 'bg-blue-500',
    'Advanced': 'bg-purple-500'
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-space-accent/20 border-space-light bg-space-light/30 backdrop-blur-sm h-full flex flex-col">
      <Link to={`/courses/${id}`} className="group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className={`absolute top-2 right-2 ${levelColors[level]}`}>
            {level}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-heading font-semibold text-lg text-white group-hover:text-space-accent transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-400">{instructor}</p>
        </CardHeader>
      </Link>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-400" fill="currentColor" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs">{duration}</span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-transparent border-gray-600 text-gray-400">
          {category}
        </Badge>
      </CardContent>
      
      <CardFooter className="pt-2 mt-auto flex items-center justify-between">
        <div className="font-semibold text-white">${price.toFixed(2)}</div>
        <Button 
          size="sm" 
          className="bg-space-accent hover:bg-space-secondary text-white"
          onClick={() => onAddToCart(course)}
        >
          <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
