
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, useAnimation, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/Navbar';
import GridSection from '../components/GridSection';
import FamilySize from '../components/FamilySize';
import BudgetPlans from '../components/BudgetPlans';
import TopSellingPlans from '../components/TopSellingPlans';
import BlogSection from '../components/BlogSection';
import ContactUs from '../components/ContactUs';
import FooterSection from '../components/FooterSection';
import TestimonialsSection from '../components/Testimonials';

// 3D Section Heading with Parallax and Gradient Line
const SectionHeading = ({ title, subtitle }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const handleMouseLeave = () => setMouse({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className="text-center mb-12 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.h2
        className="inline-block text-3xl md:text-4xl font-extrabold text-gray-800 mb-4"
        style={{
          transform: `rotateY(${mouse.x * 10}deg) rotateX(${-mouse.y * 10}deg)`,
          transition: 'transform 0.2s cubic-bezier(.25,.8,.25,1)',
          willChange: 'transform',
        }}
      >
        {title}
      </motion.h2>
      

      {subtitle && (
        <motion.p
          className="text-gray-600 mt-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

// 3D Animated Section Wrapper
const AnimatedSection = ({ children, className, delay = 0, id }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);
  return (
    <section id={id} className={`py-16 ${className} overflow-hidden`}>
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 80, scale: 0.96, rotateX: 12 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
              type: 'spring',
              stiffness: 60,
              damping: 18,
              duration: 1,
              delay,
            },
          },
        }}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-4"
        style={{ perspective: 1200 }}
      >
        {children}
      </motion.div>
    </section>
  );
};

const Home = () => {
  const [_categories, setCategories] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Parallax for hero image
  const scrollY = useMotionValue(0);
  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);
  const heroParallax = useTransform(scrollY, [0, 400], [0, 80]);

  const heroSlides = [
    {
      image: '/36522.png',
      title: 'Find your dream home',
      subtitle: 'Discover beautifully designed house plans for every lifestyle',
    },
    {
      image: '/6.jpg',
      title: 'Luxury living',
      subtitle: 'Explore our premium collection of architectural masterpieces',
    },
    {
      image: '/493.png',
      title: 'Budget-friendly options',
      subtitle: "Quality designs that won't break the bank",
    },
    {
      image: '/4.jpg',
      title: 'Rustic charm',
      subtitle: 'Cozy and inviting home designs with natural elements',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar with glass effect */}
     
      
        <Navbar />
      

      {/* Hero Section with 3D Parallax Carousel */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.08, rotateY: 18 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.96, rotateY: -18 }}
            transition={{
              duration: 1.1,
              ease: [0.6, 0.01, 0.05, 0.9],
            }}
            className="absolute inset-0"
            style={{ willChange: 'transform' }}
          >
            <motion.div
              className="relative h-full w-full"
              style={{
                y: heroParallax,
                transition: 'y 0.5s cubic-bezier(.25,.8,.25,1)',
                willChange: 'transform',
              }}
            >
              {/* Futuristic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027]/80 via-[#2c5364]/60 to-transparent z-10" />
              <img
                src={heroSlides[activeSlide].image}
                alt={heroSlides[activeSlide].title}
                className="h-full w-full object-cover object-center"
                style={{
                  filter: 'brightness(0.95) saturate(1.2) ',
                  transform: 'scale(1.04)',
                  willChange: 'transform',
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start z-20 px-6 md:px-16 lg:px-24">
                <motion.h1
                  initial={{ opacity: 0, y: 40, rotateX: 18 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 60,
                  }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl"
                  style={{
                    textShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    willChange: 'transform',
                  }}
                >
                  {heroSlides[activeSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                >
                  {heroSlides[activeSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    onClick={() => scrollToSection('explore')}
                    className="px-8 py-3 bg-gradient-to-r from-[#7f5af0] to-[#00c6fb] text-white rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.08, boxShadow: '0 8px 32px #7f5af0' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Explore Plans
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection('contact us')}
                    className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold bg-white/10 hover:bg-white/30 hover:text-[#7f5af0] transition-all duration-300"
                    whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Contact Us
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators - Futuristic style */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-[#7f5af0] ${
                index === activeSlide
                  ? 'w-12 bg-gradient-to-r from-[#7f5af0] to-[#00c6fb] shadow-lg'
                  : 'w-2 bg-white/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll down indicator */}
        <motion.div
          animate={{ y: [0, 12, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white z-30 flex flex-col items-center cursor-pointer"
          onClick={() => scrollToSection('explore')}
        >
        
        </motion.div>
      </section>

      {/* Featured Categories Section */}
      <AnimatedSection className="bg-white" id="explore">
        <SectionHeading
          title="Explore by category"
          subtitle="Whether you're looking for a cozy starter home or a spacious family residence, we have floor plans designed to fit your needs perfectly."
        />
        <GridSection />
      </AnimatedSection>

      {/* Family Size Section */}
      <AnimatedSection className="bg-gray-50" delay={0.2}>
        <SectionHeading
          title="Find the perfect size"
          subtitle="From singles to large families, discover plans tailored to your needs."
        />
        <FamilySize />
      </AnimatedSection>

      {/* Budget Plans Section */}
      <AnimatedSection className="bg-white" delay={0.3}>
        <SectionHeading
          title="Plans for every budget"
          subtitle="Quality design doesn't have to break the bank. Explore our range of affordable house plans without compromising on style or function."
        />
        <BudgetPlans />
      </AnimatedSection>

      {/* Top Selling Plans */}
      <AnimatedSection className="bg-gray-50" delay={0.2}>
        <SectionHeading
          title="Our most popular designs"
          subtitle="Discover what other homeowners are loving. These top-selling plans combine functionality, style, and value."
        />
        <TopSellingPlans />
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="bg-white" delay={0.3}>
        <SectionHeading
          title="What our clients say"
          subtitle="Don't just take our word for it. See what architects, designers, and homeowners think about The Plan Cave's architectural drawings."
        />
        <TestimonialsSection />
      </AnimatedSection>

      {/* Blog Section */}
      <AnimatedSection className="bg-white" delay={0.2}>
        <SectionHeading
          title="Home building insights"
          subtitle="Get expert advice and inspiration for your home building journey through our collection of articles and guides."
        />
        <BlogSection />
      </AnimatedSection>

      {/* Contact Us Section */}
      <ContactUs />

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/+254723029566"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, boxShadow: '0 8px 32px #43e97b' }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 left-8 bg-gradient-to-r from-[#43e97b] to-[#38f9d7] text-white p-3 rounded-full shadow-lg z-40"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 60 }}
        >
          <FooterSection />
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;
