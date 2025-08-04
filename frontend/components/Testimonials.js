import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample testimonial data - replace with actual client testimonials
  const testimonials = [
    {
      id: 1,
      name: "Diana Wandeyi",
      role: "Interior Designer",
      image: "/2.jpg",
      rating: 5,
      text: "The architectural drawings I purchased from The Plan Cave were incredibly detailed and helped me visualize the space perfectly. My clients were impressed with the quality!"
    },
    {
      id: 2,
      name: "Michael Kamau",
      role: "Property Developer",
      image: "/3.jpg",
      rating: 5,
      text: "As a developer working on multiple projects, I need reliable and accurate plans. The Plan Cave consistently delivers high-quality architectural drawings that meet all our specifications."
    },
    {
      id: 3,
      name: "Glen Mwangi",
      role: "Home Renovator",
      image: "/4.jpg",
      rating: 4,
      text: "The 3D renderings from The Plan Cave helped me visualize my renovation before committing to the changes. Their attention to detail saved me from making costly mistakes."
    },
    {
      id: 3,
      name: "Clifford Manase",
      role: "Home Renovator",
      image: "/6.jpg",
      rating: 4,
      text: "The 3D renderings from The Plan Cave helped me visualize my renovation before committing to the changes. Their attention to detail saved me from making costly mistakes."
    }

  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">

        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Large quote icon for decoration */}
          <div className="absolute -top-8 left-0 text-blue-100">
            <Quote size={80} />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
                />
                <div className="flex mt-2">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>
              
              <div className="md:w-3/4 md:pl-8">
                <p className="text-gray-700 italic text-lg mb-4">"{testimonials[currentIndex].text}"</p>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{testimonials[currentIndex].name}</span>
                  <span className="text-blue-600 text-sm">{testimonials[currentIndex].role}</span>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-center mt-8">
              <button 
                onClick={handlePrev}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 mx-2 transition-colors duration-200"
              >
                <ChevronLeft size={24} />
              </button>
              
              {/* Pagination indicators */}
              <div className="flex items-center mx-4">
                {testimonials.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
              
              <button 
                onClick={handleNext}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 mx-2 transition-colors duration-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;