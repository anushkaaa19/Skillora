import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Reviews = () => {
  const reviewsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const reviews = [
    {
      name: "Tryn Patel",
      source: "type@actor-actorenc.ney",
      comment: "Show for Data Science course helped me land my dream job at a FAANG company.",
      rating: "4.8 ★★★★☆",
    },
    {
      name: "David Wilson",
      source: "david.wolf@actor-novac.net",
      comment: "Their Board curriculum is the most up-to-date I've found. Zero fluff, all practical.",
      rating: "4.5 ★★★★",
    },
    {
      name: "Emma Garcia",
      source: "emma@freedomc.dev",
      comment: "Doubled my freelance rates after completing the advanced JavaScript certification.",
      rating: "4.0 ★★★★☆",
    },
    {
      name: "Early Fisher",
      source: "www.primarycleanapple.com",
      comment: "Coordination of activities improved tremendously with Learn codings.",
      rating: "4.5 ★★★★",
    },
    {
      name: "Esther Howard",
      source: "fethel.reed@example.com",
      comment: "Learn codings is a godsend for our disorganized team!",
      rating: "4.5 ★★★★",
    },
    {
      name: "John Smith",
      source: "jsmith@dev.io",
      comment: "Interactive lessons made complex topics easy to understand.",
      rating: "5.0 ★★★★★",
    }
  ];
  useEffect(() => {
    const checkOnMount = () => {
      if (reviewsContainerRef.current) {
        // force scroll to 0
        reviewsContainerRef.current.scrollLeft = 0;
        checkScrollPosition();
      }
    };
  
    // Delay until layout stabilizes
    const timeoutId = setTimeout(checkOnMount, 100);
  
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);
  

  const checkScrollPosition = () => {
    if (reviewsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reviewsContainerRef.current;
  
      console.log("ScrollLeft:", scrollLeft);
      console.log("ClientWidth:", clientWidth);
      console.log("ScrollWidth:", scrollWidth);
  
      setShowLeftArrow(Math.round(scrollLeft) > 0);
      setShowRightArrow(Math.round(scrollLeft + clientWidth) < Math.round(scrollWidth));
    }
  };
  
  

  const scroll = (direction) => {
    if (!reviewsContainerRef.current) return;

    const scrollAmount = 400;
    reviewsContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    // Fallback in case onScroll doesn't trigger in time
    setTimeout(() => {
      checkScrollPosition();
    }, 500);
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  return (
    <div className="relative w-full max-w-[1200px] mx-auto py-12 px-4">
      <h2 className="text-center text-3xl font-semibold mb-8 text-white">
        What Our Learners Say
      </h2>

      <div className="relative group">
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-richblack-800 p-3 rounded-full hover:bg-richblack-700 transition-all"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-white text-xl" />
          </button>
        )}

        <div 
          ref={reviewsContainerRef}
          className="flex overflow-x-auto gap-6 py-4 scrollbar-hide snap-x snap-mandatory"

          onScroll={handleScroll}
        >
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-[380px] snap-start bg-richblack-800 p-5 rounded-xl border border-richblack-600 hover:border-yellow-50 transition-colors"
            >
              <div className="flex flex-col gap-3 h-full">
                <h3 className="text-xl font-bold text-yellow-50">{review.name}</h3>
                <p className="text-richblack-300 text-sm italic">{review.source}</p>
                <p className="text-richblack-100 flex-grow">{review.comment}</p>
                <p className="text-yellow-100 font-medium mt-2">{review.rating}</p>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-richblack-800 p-3 rounded-full hover:bg-richblack-700 transition-all"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-white text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Reviews;
