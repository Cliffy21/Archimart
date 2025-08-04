import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TopSellingPlans = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef(null);

    // Check if the device is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // Common breakpoint for mobile devices
        };
        
        // Initial check
        checkIfMobile();
        
        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);
        
        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const topSellingPlans = [
        {
            id: 1,
            title: 'Modern 3-Bedroom Bungalow',
            price: '$250',
            image: '/1.jpg',
            sqft: '1,800',
            bedrooms: '3',
            bathrooms: '2',
        },
        {
            id: 2,
            title: 'Luxury 5-Bedroom Mansion',
            price: '$500',
            image: '/2.jpg',
            sqft: '4,500',
            bedrooms: '5',
            bathrooms: '4.5',
        },
        {
            id: 3,
            title: '2-Bedroom Cottage',
            price: '$150',
            image: '/1.jpg',
            sqft: '1,200',
            bedrooms: '2',
            bathrooms: '1',
        },
        {
            id: 4,
            title: 'Rustic 4-Bedroom House',
            price: '$300',
            image: '/4.jpg',
            sqft: '2,400',
            bedrooms: '4',
            bathrooms: '2.5',
        },
        {
            id: 5,
            title: 'Compact Modern Home',
            price: '$200',
            image: '/5.jpg',
            sqft: '1,500',
            bedrooms: '3',
            bathrooms: '2',
        },
        {
            id: 6,
            title: 'Country Family House',
            price: '$350',
            image: '/6.jpg',
            sqft: '3,200',
            bedrooms: '4',
            bathrooms: '3',
        },
        {
            id: 7,
            title: 'Budget-Friendly Flat',
            price: '$100',
            image: '/7.jpg',
            sqft: '950',
            bedrooms: '1',
            bathrooms: '1',
        },
        {
            id: 8,
            title: 'Luxury Villa Design',
            price: '$450',
            image: '/budget4.jpg',
            sqft: '3,800',
            bedrooms: '4',
            bathrooms: '3.5',
        },
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Consistent with other components
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Handle card click for mobile devices
    const handleCardClick = (index, e) => {
        if (isMobile) {
            // Prevent navigation when clicking on the card in mobile view
            e.preventDefault();
            
            // Toggle clicked state
            setClickedIndex(clickedIndex === index ? null : index);
        }
    };

    // Check if details should be shown (either hovered on desktop or clicked on mobile)
    const shouldShowDetails = (index) => {
        if (isMobile) {
            return clickedIndex === index;
        } else {
            return hoveredIndex === index;
        }
    };

    return (
        <section className="w-full py-12 px-4 bg-gray">
            <div className="max-w-6xl mx-auto relative">
                <div className="mb-8">
                    <div className="text-center mb-12">
                      
                    </div>
                </div>

                <div className="relative">
                    {/* Scrollable container */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {topSellingPlans.map((plan, index) => (
                            <div 
                                key={plan.id} 
                                className="snap-start flex-none w-80 md:w-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                            >
                                <Link 
                                    href={{
                                        pathname: '/all-products',
                                        query: { category: 'best-sellers', id: plan.id },
                                    }}
                                    className="block"
                                    onClick={(e) => handleCardClick(index, e)}
                                >
                                    <div className="relative h-52 md:h-56 overflow-hidden">
                                        <img 
                                            src={plan.image} 
                                            alt={plan.title} 
                                            className={`w-full h-full object-cover transition-transform duration-700 ${
                                                shouldShowDetails(index) ? 'scale-110' : 'scale-100'
                                            }`}
                                        />
                                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                            Best Seller
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{plan.title}</h3>
                                            <p className="text-blue-600 font-bold">{plan.price}</p>
                                        </div>
                                        
                                        <div className="flex items-center text-gray-600 text-sm mt-3 space-x-4">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                </svg>
                                                <span>{plan.sqft} sqft</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                </svg>
                                                <span>{plan.bedrooms} beds</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 00-3.5 3.5v9A3.5 3.5 0 005.5 18h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0014.5 2h-9zM3 5.5a2.5 2.5 0 012.5-2.5h9A2.5 2.5 0 0117 5.5V7H3V5.5zm0 4.5h14v5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 013 15v-5z" clipRule="evenodd" />
                                                </svg>
                                                <span>{plan.bathrooms} baths</span>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className={`mt-4 transition-all duration-300 ${
                                                shouldShowDetails(index) ? 'opacity-100' : 'opacity-0 md:opacity-0'
                                            }`}
                                        >
                                            <span className="block w-full py-2 text-center text-blue-600 font-medium border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
                                                View Details
                                            </span>
                                        </div>
                                        
                                        {/* Mobile-only indicator to show the card is tappable */}
                                        {isMobile && (
                                            <div className="mt-2 text-center text-xs text-gray-500">
                                                {clickedIndex === index ? 'Tap again to view' : 'Tap for more details'}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                
                    {/* Link to all best sellers */}
                    <div className="text-center mt-8">
                        <Link 
                            href={{
                                pathname: '/all-products',
                                query: { category: 'best-sellers' },
                            }}
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            View All Best Sellers
                        </Link>
                    </div>
                    
                    {/* Navigation buttons - consistent with other components */}
                    <button 
                        className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button 
                        className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default TopSellingPlans;