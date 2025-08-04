import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FamilySize = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null); 
    const [isMobileView, setIsMobileView] = useState(false);
    const scrollContainerRef = useRef(null);

    // Check if the device is mobile/tablet based on screen width
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };
        
        // Check on initial load
        checkScreenSize();
        
        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const plans = [
        { id: 1, name: "1 Bedroom Plans", image: "./7.jpg", link: "/by-size/1-bedroom" },
        { id: 2, name: "2 Bedroom Plans", image: "./2.jpg", link: "/by-size/2-bedroom" },
        { id: 3, name: "3 Bedroom Plans", image: "./5.jpg", link: "/by-size/3-bedroom" },
        { id: 4, name: "4 Bedroom Plans", image: "./4.jpg", link: "/by-size/4-bedroom" },
        { id: 5, name: "5+ Bedroom Plans", image: "./3.jpg", link: "/by-size/5-plus-bedroom" },
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 340; // Increased to account for larger cards
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Handle card click for mobile devices
    const handleCardClick = (e, index) => {
        if (isMobileView) {
            e.preventDefault(); // Prevent navigation on first click for mobile
            if (activeIndex === index) {
                // If clicking the same card that's already active, navigate to the link
                return true;
            } else {
                // If clicking a new card, activate it
                setActiveIndex(index);
                return false;
            }
        }
        // For desktop, proceed with normal link behavior
        return true;
    };

    return (
        <section className="w-full py-12 px-4 bg-grey overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <div className="mb-8">
                    <div className="text-center mb-12">
                       
                    </div>
                </div>

                <div className="relative">
                    {/* Scrollable container */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {plans.map((plan, index) => (
                            <Link 
                                key={index} 
                                href={{
                                    pathname: '/all-products',
                                    query: { category: plan.link.split('/').pop() }, // Extract the category from the link
                                }}
                                className={`snap-start flex-none w-72 h-96 relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform ${
                                    hoveredIndex === index || activeIndex === index ? 'scale-105 shadow-xl' : ''
                                }`}
                                onMouseEnter={() => !isMobileView && setHoveredIndex(index)}
                                onMouseLeave={() => !isMobileView && setHoveredIndex(null)}
                                onClick={(e) => {
                                    if (!handleCardClick(e, index)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div 
                                    className="absolute inset-0 bg-center bg-cover w-full h-full"
                                    style={{ backgroundImage: `url(${plan.image})` }}
                                >
                                    {/* Dark overlay that transitions on hover/active */}
                                    <div 
                                        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                                            hoveredIndex === index || activeIndex === index ? 'bg-opacity-60' : 'bg-opacity-30'
                                        }`}
                                    ></div>
                                    
                                    {/* Content that animates on hover/active */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <div 
                                            className={`text-center transition-all duration-300 ${
                                                hoveredIndex === index || activeIndex === index
                                                    ? 'transform scale-110 translate-y-0' 
                                                    : ''
                                            }`}
                                        >
                                            <h3 className="text-white text-xl font-semibold tracking-wide">
                                                {plan.name}
                                            </h3>
                                            
                                            {/* Additional info that appears on hover/active */}
                                            <div 
                                                className={`mt-3 transition-all duration-300 ${
                                                    hoveredIndex === index || activeIndex === index ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            >
                                                <p className="text-white text-sm font-medium mb-3">
                                                    Perfect for {plan.id === 1 ? 'couples or individuals' : 
                                                        plan.id === 5 ? 'large families' : 'families'}
                                                </p>
                                                <span className="inline-block px-4 py-2 rounded-full bg-white bg-opacity-20 text-white text-sm font-medium">
                                                    {activeIndex === index && isMobileView ? 'Tap again to view' : 'View Floor Plans'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                
                    {/* Navigation buttons */}
                    <button 
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button 
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FamilySize;