// CounterSection.js
'use client'; // Use this if you're working with Next.js 13+

import React, { useRef, useEffect } from 'react';

const CounterSection = () => {
  // Create refs for each counter
  const countersRef = useRef([]);
  
  // Stats to display
  const stats = [
    { id: 1, icon: "document", value: 5000, label: "ARCHITECTURAL PLANS", suffix: "+" },
    { id: 2, icon: "user", value: 2500, label: "HAPPY CLIENTS", suffix: "+" },
    { id: 3, icon: "building", value: 150, label: "COUNTRIES SERVED", suffix: "" },
    { id: 4, icon: "award", value: 25, label: "INDUSTRY AWARDS", suffix: "" }
  ];
  
  useEffect(() => {
    // Function to check if element is in viewport
    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    };
    
    // Function to animate counter
    const animateCounter = (el, targetValue, duration = 2000) => {
      if (!el) return;
      
      let startTime = null;
      const startValue = 0;
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function: easeOutCubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.floor(startValue + easedProgress * (targetValue - startValue));
        el.textContent = currentValue.toLocaleString() + (targetValue === 5000 || targetValue === 2500 ? '+' : '');
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    };
    
    // Function to check and start animations
    const checkAndStartAnimations = () => {
      const sectionElement = document.getElementById('counter-section');
      if (!sectionElement) return;
      
      if (isElementInViewport(sectionElement)) {
        // Start animations for each counter
        countersRef.current.forEach((counter, index) => {
          if (counter && !counter.dataset.animated) {
            animateCounter(counter, stats[index].value);
            counter.dataset.animated = 'true';
          }
        });
      }
    };
    
    // Force animation start after a short delay regardless of viewport
    const forceAnimationTimer = setTimeout(() => {
      countersRef.current.forEach((counter, index) => {
        if (counter && !counter.dataset.animated) {
          animateCounter(counter, stats[index].value);
          counter.dataset.animated = 'true';
        }
      });
    }, 1000);
    
    // Check on scroll
    window.addEventListener('scroll', checkAndStartAnimations);
    
    // Check on initial load
    checkAndStartAnimations();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', checkAndStartAnimations);
      clearTimeout(forceAnimationTimer);
    };
  }, []);
  
  // Helper function to get the icon element
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'building':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12" y2="18"></line>
          </svg>
        );
      case 'award':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="counter-section" className="py-16 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">The plan cave by numbers</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Trusted by architects, designers, and homeowners around the world for our high-quality architectural drawings.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.id} className="bg-white rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-200">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                  {getIcon(stat.icon)}
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 text-gray-800">
                {/* Use ref to get direct access to the element */}
                <span ref={el => countersRef.current[index] = el}>0</span>{stat.suffix}
              </div>
              <div className="text-blue-600 uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;