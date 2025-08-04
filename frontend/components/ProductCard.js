import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ProductCard.module.css';
import { AppContext } from '../context/AppContext';

const ProductCard = ({ product, onAddToWishlist, onAddToCart }) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const formRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const closeForm = () => setFormVisible(false);

  const { addToWishlist, addToCart} = useContext(AppContext);

  const { id, name, price, image, bedrooms, bathrooms, floors, area } = product || {};
 
  


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeForm();
      }
    };

    if (isFormVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormVisible]);

  if (!product) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const navigateToProduct = (e) => {
    // Prevent navigation if clicking on action buttons
    if (
      e.target.closest(`.${styles.actionButton}`) ||
      e.target.closest(`.${styles.wishlistButton}`)
    ) {
      return;
    }
    router.push(`/products/${id}`);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <>
      <div className={`${styles.card} ${styles.clickable}`} onClick={navigateToProduct}>
        {/* Image Section */}
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={image || '/4.jpg'}
              alt={name}
              className={`${styles.productImage} ${imageLoaded ? styles.loaded : styles.loading}`}
              onError={(e) => (e.target.src = '/3.jpg')}
              onLoad={handleImageLoad}
            />
          </div>
          <div className={styles.hoverButtons}>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                onAddToCart ? onAddToCart(product) : addToCart(product);
              }}
            >
              Quick Buy
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className={styles.cardDetails}>
          <h3 className={styles.productName}>{name}</h3>
          <p className={styles.productId}>Plan ID: {id}</p>
          <p className={styles.productPrice}>{formattedPrice}</p>

          {/* Icons Section */}
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <img src="/bed.svg" alt="Beds" className={styles.featureIcon} />
              <span>{bedrooms || '0'} Beds</span>
            </div>
            <div className={styles.feature}>
              <img src="/bathtub.svg" alt="Baths" className={styles.featureIcon} />
              <span>{bathrooms || '0'} Baths</span>
            </div>
            <div className={styles.feature}>
              <img src="/building.svg" alt="Floors" className={styles.featureIcon} />
              <span>{floors || '0'} Floors</span>
            </div>
            <div className={styles.feature}>
              <img src="/location.svg" alt="Area" className={styles.featureIcon} />
              <span>{area || '0'} sqm</span>
            </div>
          </div>

          {/* Add to Wishlist Button */}
          <button
            className={styles.wishlistButton}
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              onAddToWishlist ? onAddToWishlist(product) : addToWishlist(product);
            }}
          >
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* BuyNowForm rendered outside the card */}
      {isFormVisible && (
        <div className={styles.overlay}>
          <div ref={formRef}>
            <BuyNowForm product={product} onClose={closeForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;