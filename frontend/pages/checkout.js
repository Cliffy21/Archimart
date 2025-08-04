"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Checkout = () => {
  const { cart } = useContext(AppContext);
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1 for order summary, 2 for payment details

  useEffect(() => {
    if (router.query.cart) {
      try {
        const decodedCart = JSON.parse(decodeURIComponent(router.query.cart));
        setSelectedProduct(decodedCart);
      } catch (error) {
        console.error("Error decoding cart:", error);
      }
    }
  }, [router.query]);

  const itemsToDisplay = selectedProduct ? [...selectedProduct] : cart || [];

  const totalPrice = itemsToDisplay.reduce(
    (sum, product) => sum + (product.adjustedPrice || product.price || 0) * (product.quantity || 1),
    0
  );

  const handleSuccess = (details) => {
    console.log('[Payment] Success:', details);
    setIsProcessing(false);
    setTimeout(() => {
      router.push('/success');
    }, 3000);
  };

  const showNotification = (message) => {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.remove("hidden");
    
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  };

  const nextStep = () => {
    setStep(2);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const prevStep = () => {
    setStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      showNotification("Please select a payment method.");
      return;
    }
    
    setIsProcessing(true);
    
    if (paymentMethod !== "PayPal") {
      showNotification("Please select a valid payment method.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Progress bar */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'} z-10`}>
              1
            </div>
            <div className="text-sm absolute -bottom-6 w-20 text-center">Cart</div>
          </div>
          <div className={`h-1 w-20 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className="flex items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'} z-10`}>
              2
            </div>
            <div className="text-sm absolute -bottom-6 w-20 text-center">Payment</div>
          </div>
          <div className={`h-1 w-20 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className="flex items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'} z-10`}>
              3
            </div>
            <div className="text-sm absolute -bottom-6 w-20 text-center">Complete</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Checkout Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="opacity-80">Complete your purchase securely</p>
          </div>

          <div className="p-6">
            {step === 1 ? (
              /* Order Summary */
              <div>
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {itemsToDisplay.length === 0 ? (
                  <div className="py-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="mt-4 text-gray-600">Your cart is empty.</p>
                    <button
                      onClick={() => router.push('/all-products')}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4">
                      {itemsToDisplay.map((product) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex p-4 border border-gray-100 rounded-xl hover:shadow-md transition"
                        >
                         <div className="w-[100px] h-[100px] relative bg-gray-100 rounded">
  {product.image ? (
    <Image
      src={product.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${product.image}` : product.image}
      alt={product.name || "Product image"}
      width={100}
      height={100}
      className="object-cover rounded"
      priority={true}
      onError={(e) => {
        console.log("Image failed to load:", product.image);
        e.target.style.display = 'none';
        e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-200');
        const fallbackIcon = document.createElement('div');
        fallbackIcon.innerHTML = `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>`;
        e.target.parentNode.appendChild(fallbackIcon);
      }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  )}
</div>
                          <div className="ml-6 flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium">{product.name}</h3>
                              <p className="font-medium">
                                ${((product.adjustedPrice || product.price) * product.quantity).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">ID: {product._id}</p>
                            <div className="flex justify-between items-end mt-2">
                              <div>
                                <p className="text-sm text-gray-600">
                                  ${product.adjustedPrice || product.price} × {product.quantity}
                                </p>
                                {product.selectedFileType && product.selectedFileType !== "None" && (
                                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mt-2">
                                    {product.selectedFileType}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-blue-700">${totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => router.push('/all-products')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Continue Shopping
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                      >
                        Proceed to Payment
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Billing & Payment */
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={prevStep}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="johndoe@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
                      <div className="space-y-3">
                        <label 
                          className="flex items-center p-4 border rounded-lg cursor-pointer transition border-blue-500 bg-blue-50"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="PayPal"
                            checked={true}
                            className="form-radio text-blue-600 h-5 w-5"
                            readOnly
                          />
                          <div className="ml-3 flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-2">
                              <span className="text-white font-bold text-xs">P</span>
                            </div>
                            <span>PayPal</span>
                          </div>
                        </label>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <PayPalScriptProvider options={{ "client-id": "AdC2dB0YfKFUytBATpzCdz_3L-Cr2fX6itQBMsNra7yiNYc5UnJ3exvibJ27BM0pJQgWjVHLwqoYT9iH" }}>
                          <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(_data, actions) => {
                              return actions.order.create({
                                purchase_units: [{ amount: { value: totalPrice.toFixed(2) } }],
                              });
                            }}
                            onApprove={async (_data, actions) => {
                              try {
                                const details = await actions.order.capture();
                                handleSuccess(details);
                              } catch (error) {
                                console.error("PayPal capture error:", error);
                                showNotification("Payment processing failed. Please try again.");
                                setIsProcessing(false);
                              }
                            }}
                            onError={(err) => {
                              console.error("PayPal error:", err);
                              showNotification("PayPal encountered an error. Please try again.");
                              setIsProcessing(false);
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-xl font-semibold text-blue-700">${totalPrice.toLocaleString()}</span>
                    </div>

                    <button
                      type="submit"
                      className={`w-full ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-lg text-lg font-medium transition flex items-center justify-center`}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          Complete Purchase
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Notification */}
      <div id="notification" className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg hidden transform transition-transform duration-300">
        Please select a payment method.
      </div>
    </div>
  );
};

export default Checkout;