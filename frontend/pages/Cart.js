import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Pagination from '../components/Pagination';
import { AppContext } from '../context/AppContext';
import styles from '../styles/Cart.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const itemsPerPage = 4;
  const router = useRouter();

  const fileTypeCost = 2000; // Additional cost for CAD+PDF
  const drawingCost = 1000; // Additional cost per drawing type

  // State for cart items with additional fields
  const [cartItems, setCartItems] = useState([]);

  // Initialize cart items with additional fields
  useEffect(() => {
    if (cart && cart.length > 0) {
      const updatedCart = cart.map((item) => ({
        ...item,
        selectedFileType: item.selectedFileType || '',
        selectedDrawings: item.selectedDrawings || [],
        adjustedPrice: item.adjustedPrice || item.price,
        quantity: item.quantity || 1, // Ensure quantity is always defined
      }));
      setCartItems(updatedCart);
    } else {
      setCartItems([]);
    }
  }, [cart]);

  // Handle File Type Selection
  const handleFileTypeChange = (productId, fileType) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              selectedFileType: fileType,
              adjustedPrice: item.price + (fileType === 'CAD+PDF' ? fileTypeCost : 0),
            }
          : item
      )
    );
  };

  // Handle Drawing Selection
  const handleDrawingChange = (productId, drawingType, isChecked) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              selectedDrawings: isChecked
                ? [...item.selectedDrawings, drawingType]
                : item.selectedDrawings.filter((d) => d !== drawingType),
              adjustedPrice:
                item.price +
                (item.selectedFileType === 'CAD+PDF' ? fileTypeCost : 0) +
                (isChecked ? drawingCost : -drawingCost),
            }
          : item
      )
    );
  };

  // Update total price
  useEffect(() => {
    if (cartItems.length > 0) {
      const newTotalPrice = cartItems.reduce(
        (acc, item) => acc + item.adjustedPrice * item.quantity,
        0
      );
      setTotalPrice(newTotalPrice.toFixed(2));
    } else {
      setTotalPrice(0);
    }
  }, [cartItems]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckout = () => {
    try {
      // Safe serialization - only keep essential data
      const safeCartItems = cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        adjustedPrice: item.adjustedPrice,
        quantity: item.quantity,
        selectedFileType: item.selectedFileType,
        // Ensure image paths are clean strings without special characters
        image: typeof item.image === 'string' ? item.image : null
      }));

          // First try to use localStorage for larger carts
    localStorage.setItem('checkoutItems', JSON.stringify(safeCartItems));

     // Then use minimal data in URL
     router.push({
      pathname: '/checkout',
      query: { checkoutId: Date.now() }  // Just use a timestamp as identifier
    });
  } catch (error) {
    console.error("Error during checkout redirect:", error);
    // Fallback approach - go to checkout without query params
    router.push('/checkout');
  }
};

  // Handle quantity change directly in the cartItems state
  const handleQuantityChange = (productId, newQuantity) => {
    // Ensure quantity is a valid number and at least 1
    const validQuantity = Math.max(1, isNaN(newQuantity) ? 1 : newQuantity);
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: validQuantity }
          : item
      )
    );
    
    // Also update the quantity in the AppContext
    updateCartQuantity(productId, validQuantity);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.heading}>Cart</h1>

      {!cartItems || cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <img src="/shopping.png" alt="Empty Cart" />
          <p>Your cart is empty. Start adding your favorite plans!</p>
          <a href="/all-products" className={styles.continueShopping}>
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div className={styles.productList}>
            {cartItems
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((product) => (
                <div key={product._id} className={styles.productCard}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  <div className={styles.productDetails}>
                    <h2>{product.name}</h2>
                    <p>Base Price: USD {product.price}</p>
                    <p>Final Price: USD {product.adjustedPrice}</p>
                    <p>Area: {product.area} sqm</p>

                    {/* File Type Selection */}
                    <div className={styles.selectionBox}>
                      <h4>Select File Type</h4>
                      <label>
                        <input
                          type="radio"
                          name={`fileType-${product._id}`}
                          value="CAD+PDF"
                          checked={product.selectedFileType === "CAD+PDF"}
                          onChange={(e) => handleFileTypeChange(product._id, e.target.value)}
                        />
                        CAD + PDF
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`fileType-${product._id}`}
                          value="PDF"
                          checked={product.selectedFileType === "PDF"}
                          onChange={(e) => handleFileTypeChange(product._id, e.target.value)}
                        />
                        PDF
                      </label>
                    </div>

                    {/* Drawing Type Selection */}
                    <div className={styles.selectionBox}>
                      <h4>Select Drawing Types</h4>
                      {['Architectural', 'Structural'].map(
                        (drawingType) => (
                          <label key={drawingType}>
                            <input
                              type="checkbox"
                              value={drawingType}
                              checked={product.selectedDrawings && product.selectedDrawings.includes(drawingType)}
                              onChange={(e) =>
                                handleDrawingChange(product._id, drawingType, e.target.checked)
                              }
                            />
                            {drawingType}
                          </label>
                        )
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className={styles.quantityInput}
                        value={product.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(product._id, parseInt(e.target.value) || 1)
                        }
                        min="1"
                      />
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromCart(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(cartItems.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />

          {/* Cart Summary */}
          <div className={styles.cartSummary}>
            <h2>Cart Summary</h2>
            <p>Total Items: {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}</p>
            <p>Total Price: USD {totalPrice}</p>

            <div className={styles.paymentMethods}>
              <Slider {...settings}>
                <div>
                  <img src="/paypal.png" alt="Paypal" className={styles.paymentIcon} />
                </div>
                <div>
                  <img src="/master.png" alt="Master" className={styles.paymentIcon} />
                </div>
                <div>
                  <img src="/Mpepe.png" alt="M-pesa" className={styles.paymentIcon} />
                </div>
                <div>
                  <img src="/google-pay.png" alt="GooglePay" className={styles.paymentIcon} />
                </div>
              </Slider>
            </div>

            <button className={styles.checkoutButton} onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;