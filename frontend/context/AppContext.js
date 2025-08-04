
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create the context
export const AppContext = createContext();

// Custom hook for easier context access
export const useAppContext = () => useContext(AppContext);

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const updateCartQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Function to add a product to the wishlist
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item._id === product._id)) {
        toast.info('Product already in wishlist!');
        return prevWishlist;
      }
      toast.success('Product added to wishlist!');
      return [...prevWishlist, product];
    });
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item._id !== productId));
    toast.success('Product removed from wishlist!');
  };

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item._id === product._id)) {
        toast.info('Product already in cart!');
        return prevCart;
      }
      toast.success('Product added to cart!');
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    toast.success('Product removed from cart!');
  };

  // Debugging: Log updates to wishlist or cart (optional)
  useEffect(() => {
    console.log('Wishlist updated:', wishlist);
    console.log('Cart updated:', cart);
  }, [wishlist, cart]);

  // Context value provided to children
  const contextValue = {
    wishlist,
    cart,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    removeFromCart,
    updateCartQuantity, // Include updateCartQuantity in context
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
