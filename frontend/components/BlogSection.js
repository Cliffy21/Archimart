import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const NewArrivalsSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const scrollContainerRef = useRef(null);

    // Modified to be more like new arrivals rather than blog posts
    const newArrivals = [
        {
            id: 1,
            title: 'Modern Minimalist Home',
            description: 'A sleek and stylish modern design perfect for urban settings.',
            image: './blog1.jpg',
            date: 'Mar 2, 2025',
            price: '$299',
            category: 'modern',
        },
        {
            id: 2,
            title: 'Budget-Friendly Family Home',
            description: 'Affordable 3-bedroom design without compromising on comfort.',
            image: './blog2.jpg',
            date: 'Feb 28, 2025',
            price: '$199',
            category: 'budget',
        },
        {
            id: 3,
            title: 'Luxury Countryside Villa',
            description: 'Exquisite 5-bedroom villa with premium finishes throughout.',
            image: './blog3.jpg',
            date: 'Feb 25, 2025',
            price: '$499',
            category: 'luxury',
        },
        {
            id: 4,
            title: 'Compact Urban Apartment',
            description: 'Clever design that maximizes space in a smaller footprint.',
            image: './blog4.jpg',
            date: 'Feb 20, 2025',
            price: '$149',
            category: 'apartment',
        },
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="w-full py-12 px-4 bg-white-50">
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
                        {newArrivals.map((plan, index) => (
                            <div 
                                key={plan.id} 
                                className="snap-start flex-none w-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Link 
                                    href={{
                                        pathname: '/all-products',
                                        query: { category: 'new-arrivals', id: plan.id },
                                    }}
                                    className="block"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img 
                                            src={plan.image} 
                                            alt={plan.title} 
                                            className={`w-full h-full object-cover transition-transform duration-700 ${
                                                hoveredIndex === index ? 'scale-110' : 'scale-100'
                                            }`}
                                        />
                                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>New Arrival</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {plan.price}
                                        </div>
                                    </div>
                                    
                                    <div className="p-5">
                                        <div className="flex items-center text-xs text-gray-500 mb-2">
                                            <Clock className="mr-1 w-3 h-3" />
                                            <span>Added {plan.date}</span>
                                        </div>
                                        
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{plan.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                                        
                                        <div 
                                            className={`transition-all duration-300 ${
                                                hoveredIndex === index ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                                            }`}
                                        >
                                            <span className="block w-full py-2 text-center bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
                                                View New Plan
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                
                    {/* Link to all new arrivals */}
                    <div className="text-center mt-8">
                        <Link 
                            href={{
                                pathname: '/all-products',
                                query: { category: 'new-arrivals' },
                            }}
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            View All New Arrivals
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

export default NewArrivalsSection;