import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GridSection = () => {
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
        { name: 'Modern Plans', category: 'modern', image: './1.jpg', description: 'Clean lines and minimalist design' },
        { name: 'Contemporary Plans', category: 'contemporary', image: './2.jpg', description: 'Current trends with innovative features' },
        { name: 'Luxury Plans', category: 'luxury', image: './3.jpg', description: 'Premium features and elegant details' },
        { name: 'Apartment Plans', category: 'apartments', image: './4.jpg', description: 'Efficient use of space for urban living' },
        { name: 'Country Plans', category: 'country', image: './5.jpg', description: 'Rustic charm with modern amenities' },
        { name: 'Bungalow Plans', category: 'bungalow', image: './6.jpg', description: 'Single-story living with style' },
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
        <section className="w-full py-12 px-4 bg-white-50 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <div className="mb-8">
                    <div className="text-center mb-12"></div>
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
                                    query: { category: plan.category },
                                }}
                                className={`snap-start flex-none w-72 h-96 relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform ${
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
                                    {/* Gradient overlay that enhances on hover/active */}
                                    <div 
                                        className={`absolute inset-0 bg-gradient-to-t from-black to-transparent transition-opacity duration-300 ${
                                            hoveredIndex === index || activeIndex === index ? 'opacity-90' : 'opacity-70'
                                        }`}
                                    ></div>
                                    
                                    {/* Content container with hover/active animations */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                                        <div 
                                            className={`transition-all duration-300 transform ${
                                                hoveredIndex === index || activeIndex === index ? 'translate-y-0' : 'translate-y-2'
                                            }`}
                                        >
                                            <h3 className="text-white text-xl font-semibold mb-2">
                                                {plan.name}
                                            </h3>
                                            
                                            {/* Description that appears on hover/active */}
                                            <p 
                                                className={`text-white text-sm transition-all duration-300 ${
                                                    hoveredIndex === index || activeIndex === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                                                }`}
                                            >
                                                {plan.description}
                                            </p>
                                            
                                            {/* Button that appears on hover/active */}
                                            <div 
                                                className={`mt-4 transition-all duration-300 ${
                                                    hoveredIndex === index || activeIndex === index ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                                                }`}
                                            >
                                                <span className="inline-block px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-md text-white text-sm font-medium border border-white border-opacity-30">
                                                    {activeIndex === index && isMobileView ? 'Tap again to explore' : 'Explore Style'}
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

export default GridSection;