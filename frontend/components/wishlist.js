import React, { useContext } from 'react';
import styles from '../styles/Wishlist.module.css'; // Separate styling file for Wishlist
import { AppContext } from '../context/AppContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(AppContext);

  return (
    <div className={styles.wishlistContainer}>
     <h1 className={styles.heading}>Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className={styles.productList}>
          {wishlist.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <h2>{product.name}</h2>
                <p>Price: ${product.price}</p>
                <p>{product.bedrooms} Beds, {product.bathrooms} Baths</p>
                <div className={styles.buttons}>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className={styles.moveToCartButton}
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
