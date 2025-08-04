import React, { useState, useContext } from 'react';

import FooterSection from '../components/FooterSection';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { AppContext } from '../context/AppContext';
import styles from '../styles/Wishlist.module.css';
import ContactUs from '../components/ContactUs';

const WishlistPage = () => {
  const { wishlist } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Set items per page

  // Calculate total pages
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  // Slice wishlist based on current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.wishlistContainer}>
      
      <h1 className={styles.heading}>Wishlist</h1>
      {wishlist.length === 0 ? (
        // Empty Wishlist State
        <div className={styles.emptyWishlist}>
          <img
            src="/shopping.png" // Replace with your empty state image
            alt="Empty Wishlist"
          />
          <p>Your wishlist is empty. Start adding your favorite plans!</p>
          <a href="/all-products" className={styles.continueShopping}>
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div className={styles.productList}>
            {currentItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
        <ContactUs />
      <FooterSection />
    </div>
  );
};

export default WishlistPage;
