import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { motion, _AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faCreditCard, faTag, faHeadset } from '@fortawesome/free-solid-svg-icons';

const ContactSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiper, setSwiper] = useState(null);

  const slides = [
    {
      mainIcon: faHeadset,
      title: 'Customer Service',
      description: 'We\'re here to help with any questions about our services',
      contactInfo: [
        { 
          icon: faEnvelope,
          text: 'info@theplancave.com',
          link: 'mailto:info@theplancave.com',
          animation: { y: -5, transition: { type: 'spring', stiffness: 300 } }
        },
        { 
          icon: faWhatsapp,
          text: '+254 710 208 187',
          link: 'https://wa.me/254723029566',
          animation: { y: -5, transition: { type: 'spring', stiffness: 300, delay: 0.1 } }
        },
        { 
          icon: faPhone,
          text: 'Monday to Friday, 9:00 AM to 4:00 PM',
          link: null,
          animation: { y: -5, transition: { type: 'spring', stiffness: 300, delay: 0.2 } }
        }
      ]
    },
    {
      mainIcon: faCreditCard,
      title: 'Secure Payment',
      description: 'Multiple payment options available for your convenience.',
      paymentMethods: [
        { name: 'Credit/Debit cards', animDelay: 0 },
        { name: 'Bank transfers', animDelay: 0.1 },
        { name: 'GPay', animDelay: 0.2 },
        { name: 'PayPal', animDelay: 0.3 }
      ]
    },
    {
      mainIcon: faTag,
      title: 'Refer & Earn',
      description: 'Share with friends and earn rewards!',
      socialIcons: [
        { icon: faFacebook, link: 'https://facebook.com/theplancave', color: '#3b5998', delay: 0 },
        { icon: faTwitter, link: 'https://twitter.com/theplancave', color: '#1DA1F2', delay: 0.1 },
        { icon: faInstagram, link: 'https://instagram.com/theplancave24', color: '#E1306C', delay: 0.2 },
        { icon: faWhatsapp, link: 'https://wa.me/?text=Check%20out%20The%20Plan%20Cave%20for%20architectural%20designs!%20https://theplancave.com', color: '#25D366', delay: 0.3 }
      ],
      referralCode: "PLANFRIEND2025"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  // Navigate to next slide
  const goNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  // Navigate to previous slide
  const goPrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };
  
  // Custom navigation buttons using circles with icons
  const renderNavigation = () => {
    return (
      <div className="custom-navigation">
        <button className="nav-button prev" onClick={goPrev} aria-label="Previous slide">
          <span>‹</span>
        </button>
        <button className="nav-button next" onClick={goNext} aria-label="Next slide">
          <span>›</span>
        </button>
      </div>
    );
  };

  // Custom bullet rendering for pagination
  const renderBullet = (index, className) => {
    return `<span class="${className} custom-bullet ${index === activeSlide ? 'active-bullet' : ''}"></span>`;
  };

  return (
    <section className="contact-slider-container">
      <motion.div 
        className="contact-slider-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
       
      </motion.div>

      <div className="slider-wrapper">
        <Swiper
          modules={[EffectCoverflow, Pagination, Autoplay]}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ 
            clickable: true,
            renderBullet: renderBullet
          }}
          autoplay={{ 
            delay: 5000,
            disableOnInteraction: false
          }}
          loop={true}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex % slides.length)}
          onSwiper={setSwiper}
          className="contact-swiper"
        >
          {slides.map((slide, slideIndex) => (
            <SwiperSlide key={slideIndex} className="contact-slide">
              <motion.div 
                className="slide-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="icon-circle"
                  variants={itemVariants}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }
                  }}
                >
                  <FontAwesomeIcon icon={slide.mainIcon} className="main-icon" />
                </motion.div>
                
                <motion.h3 variants={itemVariants}>{slide.title}</motion.h3>
                <motion.p variants={itemVariants} className="slide-description">{slide.description}</motion.p>
                
                {/* Customer Service Contact Info */}
                {slide.contactInfo && (
                  <div className="contact-info">
                    {slide.contactInfo.map((item, i) => (
                      <motion.div 
                        key={i}
                        className="contact-item"
                        whileHover={item.animation}
                        variants={itemVariants}
                      >
                        <FontAwesomeIcon icon={item.icon} className="contact-icon" />
                        {item.link ? (
                          <a href={item.link} className="contact-link" target="_blank" rel="noopener noreferrer">
                            {item.text}
                          </a>
                        ) : (
                          <span className="contact-text">{item.text}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Payment Methods */}
                {slide.paymentMethods && (
                  <div className="payment-methods">
                    {slide.paymentMethods.map((method, i) => (
                      <motion.div 
                        key={i} 
                        className="payment-method"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        {method.name}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Social Sharing */}
                {slide.socialIcons && (
                  <>
                    <motion.div className="social-icons" variants={containerVariants}>
                      {slide.socialIcons.map((social, i) => (
                        <motion.a 
                          key={i}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          style={{ backgroundColor: social.color }}
                          variants={itemVariants}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          <FontAwesomeIcon icon={social.icon} />
                        </motion.a>
                      ))}
                    </motion.div>
                    
                    {slide.referralCode && (
                      <motion.div 
                        className="referral-code"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span>Use code: </span>
                        <motion.span 
                          className="code"
                          whileHover={{ scale: 1.1 }}
                        >
                          {slide.referralCode}
                        </motion.span>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        {renderNavigation()}
      </div>
    </section>
  );
};

export default ContactSlider;