import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

// MegaDropdown component for "By size" and similar categories (desktop)
const MegaDropdown = ({ title, categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex items-center px-4 py-2 text-slate-200 hover:text-teal-300 transition-colors duration-300"
      >
        {title}
        <svg 
          className={`ml-1 w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </a>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-max bg-slate-900/90 backdrop-blur-lg rounded-md shadow-xl z-50 border border-teal-400/20 overflow-hidden transition-all duration-300 transform origin-top">
          <div className="grid grid-cols-3 gap-6 p-5">
            {categories.map((category, index) => (
              <div key={index} className="min-w-[220px]">
                <h3 className="text-teal-400 font-semibold mb-3 pb-2 border-b border-teal-400/20">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        href={`/all-products?${category.filterType}=${item.value}`}
                        className="block px-3 py-1.5 text-slate-300 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

// Regular dropdown for simpler menus (desktop)
const Dropdown = ({ title, items, filterType, customLinks = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex items-center px-4 py-2 text-slate-200 hover:text-teal-300 transition-colors duration-300"
      >
        {title}
        <svg 
          className={`ml-1 w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </a>
      
      <ul 
        className={`absolute left-0 top-full mt-1 w-56 bg-slate-900/90 backdrop-blur-lg rounded-md shadow-xl z-50 border border-teal-400/20 overflow-hidden transition-all duration-300 origin-top ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {items.map((item, index) => (
          <li key={index}>
            {customLinks ? (
              <Link 
                href={item.path}
                className="block px-4 py-2.5 text-slate-300 hover:text-teal-300 hover:bg-slate-800 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <Link 
                href={`/all-products?${filterType}=${item.value}`}
                className="block px-4 py-2.5 text-slate-300 hover:text-teal-300 hover:bg-slate-800 transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

// Mobile nested dropdown component for "By size"
const MobileNestedDropdown = ({ title, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveCategory(null);
    }
  };

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <li className="border-b border-slate-700">
      <a
        href="#"
        onClick={toggleDropdown}
        className="flex justify-between items-center px-6 py-4 text-slate-200 hover:text-teal-300"
      >
        <span>{title}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </a>
      
      {isOpen && (
        <div className="bg-slate-800/50">
          {categories.map((category, index) => (
            <div key={index} className="border-t border-slate-700">
              <div 
                className="flex justify-between items-center px-8 py-3 cursor-pointer"
                onClick={() => toggleCategory(index)}
              >
                <h3 className="text-teal-400 font-medium">{category.title}</h3>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${activeCategory === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {activeCategory === index && (
                <ul className="pb-3 bg-slate-800/30">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        href={`/all-products?${category.filterType}=${item.value}`}
                        className="block px-12 py-2 text-slate-300 hover:text-teal-300 hover:bg-slate-700/50 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

// Mobile dropdown for simpler menus
const MobileDropdown = ({ title, items, filterType, customLinks = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <li className="border-b border-slate-700">
      <a
        href="#"
        onClick={toggleDropdown}
        className="flex justify-between items-center px-6 py-4 text-slate-200 hover:text-teal-300"
      >
        <span>{title}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </a>
      
      {isOpen && (
        <ul className="bg-slate-800/50 pb-3">
          {items.map((item, index) => (
            <li key={index}>
              {customLinks ? (
                <Link 
                  href={item.path}
                  className="block px-10 py-2.5 text-slate-300 hover:text-teal-300 hover:bg-slate-700/50 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <Link 
                  href={`/all-products?${filterType}=${item.value}`}
                  className="block px-10 py-2.5 text-slate-300 hover:text-teal-300 hover:bg-slate-700/50 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false); 
  const { wishlist, cart } = useAppContext();
  const [user, setUser] = useState(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTabletOrMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Get user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      window.location.href = `/search?query=${searchTerm}`;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  // Data for dropdowns
  const sizeCategories = [
    {
      title: "Plans by area (SQM)",
      filterType: "area",
      items: [
        { label: '750+ SQM', value: '750plus' },
        { label: '500-750 SQM', value: '500-750' },
        { label: '400-500 SQM', value: '400-500' },
        { label: '300-400 SQM', value: '300-400' },
        { label: '200-300 SQM', value: '200-300' },
        { label: '100-200 SQM', value: '100-200' },
        { label: 'Under 100 SQM', value: 'under100' },
      ]
    },
    {
      title: "Plans by bedrooms",
      filterType: "bedrooms",
      items: [
        { label: '5+ Bedrooms', value: '5plus' },
        { label: '4 Bedrooms', value: '4' },
        { label: '3 Bedrooms', value: '3' },
        { label: '2 Bedrooms', value: '2' },
        { label: '1 Bedroom', value: '1' },
      ]
    },
    {
      title: "Plans by floors",
      filterType: "floors",
      items: [
        { label: '1 Floor', value: '1' },
        { label: '2 Floors', value: '2' },
        { label: '3 Floors', value: '3' },
        { label: '4+ Floors', value: '4plus' },
      ]
    }
  ];

  const styleItems = [
    { label: 'Modern house plans', value: 'modern' },
    { label: 'Contemporary plans', value: 'contemporary' },
    { label: 'Bungalow plans', value: 'bungalow' },
    { label: 'Luxury plans', value: 'luxury' },
    { label: 'Rustic plans', value: 'rustic' },
    { label: 'Country plans', value: 'country' },
  ];

  const budgetItems = [
    { label: 'Under $100 Plans', value: 'under-100' },
    { label: '$100 - $300 Plans', value: '100-300' },
    { label: '$300 - $500 Plans', value: '300-500' },
    { label: '$500 - $700 Plans', value: '500-700' },
    { label: '$700+ Plans', value: '700-plus' },
  ];

  const learnItems = [
    { label: "Building Designs", path: "/learn/building-designs" },
    { label: "Design Costs", path: "/learn/design-costs" }
  ];

  return (
    <>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && isTabletOrMobile && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-teal-400/20 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
 <div className="flex-shrink-0">
    <Link href="/">
      <div className="h-12 w-48 flex items-center">
        <img 
          src="/Logo2.svg" 
          alt="Logo" 
          className="h-10"
        />
      </div>
    </Link>
  </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center space-x-1">
              <li>
                <Link href="/all-products" className="px-4 py-2 text-slate-200 hover:text-teal-300 transition-colors duration-300">
                  Shop
                </Link>
              </li>
              <MegaDropdown title="By size" categories={sizeCategories} />
              <Dropdown
                title="By style"
                filterType="style"
                items={styleItems}
              />
              <Dropdown
                title="By budget"
                filterType="budget"
                items={budgetItems}
              />
              <Dropdown
                title="Learn"
                items={learnItems}
                customLinks={true}
              />
              <li>
                <Link href="/custom-plans" className="px-4 py-2 text-slate-200 hover:text-teal-300 transition-colors duration-300">
                  Custom plan
                </Link>
              </li>
            </ul>
          </div>

          {/* Icons Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="pl-10 pr-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 w-40 md:w-52"
              />
            </div>

            {/* Wishlist */}
            <div className="relative">
              <Link href="/Wishlist" className="p-2 text-slate-300 hover:text-teal-300 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length > 99 ? '99+' : wishlist.length}
                  </span>
                )}
              </Link>
            </div>

            {/* User Profile */}
            <div className="relative">
              {user ? (
                <div className="group">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-slate-600 bg-slate-800">
                    {user.image || user.avatar ? (
                      <img
                        src={user.image || user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    )}
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-slate-900/95 backdrop-blur-lg rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50 border border-teal-400/20">
                    <div className="px-4 py-3 text-sm border-b border-slate-700">
                      <p className="text-slate-200 font-medium truncate">
                        {user.firstName || user.first_name || user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-300"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="p-2 text-slate-300 hover:text-teal-300 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </Link>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <Link href="/Cart" className="p-2 text-slate-300 hover:text-teal-300 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length > 99 ? '99+' : cart.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            {isTabletOrMobile && (
              <button 
                onClick={toggleMobileMenu}
                className="ml-2 p-2 rounded-md text-slate-300 hover:text-teal-300 hover:bg-slate-800/50 lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isTabletOrMobile && (
          <div 
            className={`fixed top-16 right-0 bottom-0 w-full max-w-sm bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="py-2">
              {/* Mobile Search */}
              <div className="px-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <ul>
                <li className="border-b border-slate-700">
                  <Link 
                    href="/all-products" 
                    className="block px-6 py-4 text-slate-200 hover:text-teal-300"
                    onClick={toggleMobileMenu}
                  >
                    Shop
                  </Link>
                </li>
                <MobileNestedDropdown title="By size" categories={sizeCategories} />
                <MobileDropdown
                  title="By style"
                  filterType="style"
                  items={styleItems}
                />
                <MobileDropdown
                  title="By budget"
                  filterType="budget"
                  items={budgetItems}
                />
                <MobileDropdown
                  title="Learn"
                  items={learnItems}
                  customLinks={true}
                />
                <li className="border-b border-slate-700">
                  <Link 
                    href="/custom-plans" 
                    className="block px-6 py-4 text-slate-200 hover:text-teal-300"
                    onClick={toggleMobileMenu}
                  >
                    Custom plan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;