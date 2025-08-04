
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, Search, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';


// Mock data - replace with actual API calls in production
const designCategories = [
  { id: 1, name: 'Modern', count: 24 },
  { id: 2, name: 'Contemporary', count: 18 },
  { id: 3, name: 'Luxury Villas', count: 15 },
  { id: 4, name: 'Residentials', count: 12 },
  { id: 5, name: 'Mansions', count: 20 },
  { id: 6, name: 'Bungalows', count: 9 },
];

const buildingDesigns = [
  {
    id: 1,
    title: 'Urban Loft Design',
    description: 'Modern open concept with industrial elements',
    image: '/7.jpg',
    category: 'Modern',
    area: '2,400 sq ft',
    rooms: 4,
    featured: true,
  },
  {
    id: 2,
    title: 'Modern Open Concept',
    description: 'Modern open concept with industrial elements',
    image: '/6.jpg',
    category: 'Modern',
    area: '2,300 sq ft',
    rooms: 5,
    featured: true,
  },
  {
    id: 3,
    title: 'Urban Luxury design',
    description: 'Modern open concept with industrial elements',
    image: '/4.jpg',
    category: 'Modern',
    area: '2,100 sq ft',
    rooms: 3,
    featured: true,
  },
  // ... rest of the designs
];

const DesignCard = ({ design }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut" 
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)"
      }}
      className="design-card bg-white rounded-lg overflow-hidden shadow-md"
    >
      <motion.div 
        className="relative h-48 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.img 
          src={design.image} 
          alt={design.title} 
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        {design.featured && (
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded"
          >
            Featured
          </motion.span>
        )}
      </motion.div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{design.title}</h3>
        <p className="text-gray-600 mb-3">{design.description}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>{design.category}</span>
          <span>{design.area}</span>
          <span>{design.rooms} Rooms</span>
        </div>
        <Link href={`/learn/building-designs/${design.id}`}>
          <motion.div
            whileHover={{ 
              x: 5,
              transition: { duration: 0.2 }
            }}
            className="flex items-center text-primary hover:text-primary-dark"
          >
            View Details <ArrowRight size={16} className="ml-1" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

const FilterSection = ({ categories, activeFilters, setActiveFilters }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleFilter = (categoryId) => {
    if (activeFilters.includes(categoryId)) {
      setActiveFilters(activeFilters.filter(id => id !== categoryId));
    } else {
      setActiveFilters([...activeFilters, categoryId]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 mb-6"
    >
      <motion.div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <h3 className="text-lg font-semibold flex items-center">
          <Filter size={18} className="mr-2" /> Filter Designs
        </h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <h4 className="font-medium mb-2">Design Style</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <motion.div 
                  key={category.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * category.id }}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={activeFilters.includes(category.id)}
                    onChange={() => toggleFilter(category.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${category.id}`} className="flex-1 cursor-pointer">
                    {category.name}
                  </label>
                  <span className="text-gray-500 text-sm">({category.count})</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function BuildingDesigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState(buildingDesigns);

  useEffect(() => {
    let results = buildingDesigns;
    
    // Existing filtering logic remains the same
    if (searchQuery) {
      results = results.filter(design => 
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilters.length > 0) {
      const selectedCategories = designCategories
        .filter(cat => activeFilters.includes(cat.id))
        .map(cat => cat.name);
      
      results = results.filter(design => 
        selectedCategories.includes(design.category)
      );
    }
    
    setFilteredDesigns(results);
  }, [searchQuery, activeFilters]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Head>
        <title>Building Designs | Learn</title>
        <meta name="description" content="Explore our collection of building designs" />
      </Head>
      

      {/* Hero Section with Parallax-like Effect */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-80 mb-12 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <motion.img 
          src="/4.jpg" 
          alt="Building Designs" 
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-8">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Building Designs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white text-xl max-w-2xl"
          >
            Explore our collection of innovative and sustainable building designs for your next project
          </motion.p>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <FilterSection 
              categories={designCategories} 
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </div>
          
          <div className="md:w-3/4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative mb-6"
            >
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </motion.div>
            
            {/* Featured Designs */}
            <AnimatePresence>
              {filteredDesigns.some(design => design.featured) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold mb-4">Featured Designs</h2>
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {filteredDesigns
                      .filter(design => design.featured)
                      .map(design => (
                        <DesignCard key={design.id} design={design} />
                      ))
                    }
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* All Designs */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Designs</h2>
              <AnimatePresence>
                {filteredDesigns.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredDesigns.map(design => (
                      <DesignCard key={design.id} design={design} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-500">No designs found matching your criteria.</p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters([]);
                      }}
                      className="mt-4 text-primary hover:underline"
                    >
                      Clear filters
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 rounded-xl p-8 text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to explore costs?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Discover the estimated costs for your favorite building designs and plan your budget effectively.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/learn/design-costs">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-block text-black bg-primary px-6 py-3 rounded-lg"
            >
              View Design Costs
            </motion.div>
          </Link>
          <Link href="/all-products">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center text-white bg-black px-6 py-3 rounded-lg"
            >
              <ShoppingBag size={18} className="mr-2" />
              Checkout Our Shop
            </motion.div>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
