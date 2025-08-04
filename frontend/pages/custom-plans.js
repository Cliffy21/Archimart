import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { HomeIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import ContactUs from '../components/ContactUs';
import axios from 'axios'; // Make sure to install axios if not already installed

const CustomPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [floors, setFloors] = useState(1);
  const [area, setArea] = useState(150);
  const [totalCost, setTotalCost] = useState(0);
  const [housePlans, setHousePlans] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, submitting, success, error
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');
 
  const { addToCart } = useCart();

  // Calculate total cost whenever customization options change
  useEffect(() => {
    if (selectedPlan) {
      calculateTotalCost();
    }
  }, [selectedPlan, bedrooms, bathrooms, floors, area]);

  // Calculate total cost
  const calculateTotalCost = () => {
    if (!selectedPlan) return 0;
    let cost = Number(selectedPlan.basePrice);
    cost += Number(bedrooms) * 1000; // $1000 per bedroom
    cost += Number(bathrooms) * 800; // $800 per bathroom
    cost += Number(floors) * 2000; // $2000 per floor
    cost += Number(area) * 50; // $50 per square meter
    setTotalCost(cost.toFixed(2));
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPlanName(plan.name);
    calculateTotalCost();
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedPlan) {
      alert('Please select a plan first!');
      return;
    }

    const cartItem = {
      id: `custom-${selectedPlan.id}-${Date.now()}`, // Ensure unique ID for custom plans
      name: planName || selectedPlan.name,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      floors: parseInt(floors),
      area: parseInt(area),
      totalCost: parseFloat(totalCost),
      basePrice: selectedPlan.basePrice,
      description: selectedPlan.description,
      image: selectedPlan.image,
      isCustom: true, // Flag to identify this as a custom plan
      customizationDetails: {
        basePlan: selectedPlan.name,
        additionalRequirements: additionalRequirements,
      }
    };

    // Add the item to the cart
    setCartItems([...cartItems, cartItem]);
    addToCart(cartItem);
    
    alert(`Added "${cartItem.name}" to cart!`);
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle plan submission for review
  const handleSubmitForReview = async () => {
    // Validate inputs
    const newErrors = {};
    
    if (!selectedPlan) {
      newErrors.plan = 'Please select a plan';
    }
    
    if (!userEmail) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(userEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmissionStatus('submitting');
    setSubmissionError('');
    
    // Create the customized plan data
    const customizedPlan = {
      id: `custom-${selectedPlan.id}-${Date.now()}`,
      planName: planName || selectedPlan.name,
      basePlan: selectedPlan.name,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      floors: parseInt(floors),
      area: parseInt(area),
      totalCost: parseFloat(totalCost),
      customerEmail: userEmail,
      additionalRequirements: additionalRequirements,
      submissionDate: new Date().toISOString(),
      supportEmail: 'support@theplancave.com', // The recipient email for review
    };

    try {
      // Send the customized plan to the backend API
      const response = await axios.post('/api/custom-plans/submit', customizedPlan);
      
      console.log('Submitted plan for review:', response.data);
      
      // Reset form after successful submission
      setSubmissionStatus('success');
      
      // Add to cart with custom flag
      const wishlistItem = {
        ...customizedPlan,
        image: selectedPlan.image,
        description: `Custom ${selectedPlan.name} - Submitted for review`,
        isCustom: true,
        status: 'Under Review',
      };
      addToCart(wishlistItem);
      
    } catch (error) {
      console.error('Error submitting plan for review:', error);
      setSubmissionStatus('error');
      setSubmissionError(error.response?.data?.message || 'Failed to submit plan. Please try again later.');
    }
  };

  // Fetch house plans from the API
  useEffect(() => {
    const fetchHousePlans = async () => {
      try {
        // In a real application, replace with actual API call
        // const response = await axios.get('/api/house-plans');
        // setHousePlans(response.data);
        
        // Using sample data for now
        const sampleHousePlans = [
          {
            id: 1,
            name: 'Modern Bungalow',
            image: '/1.jpg',
            basePrice: 5000,
            description: 'A sleek and modern single-story home design.',
          },
          {
            id: 2,
            name: 'Contemporary Villa',
            image: '/3.jpg',
            basePrice: 8000,
            description: 'A luxurious two-story villa with modern amenities.',
          },
          {
            id: 3,
            name: 'Rustic Cottage',
            image: '/5.jpg',
            basePrice: 4000,
            description: 'A cozy and charming cottage design.',
          },
        ];
        setHousePlans(sampleHousePlans);
      } catch (error) {
        console.error('Error fetching house plans:', error);
      }
    };
    
    fetchHousePlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Customize Your Dream Home</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a base plan, customize to your preferences, and submit for review by our architects.
            We'll send your personalized design to your email.
          </p>
        </div>

        {submissionStatus === 'success' ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your custom plan request. Our architects will review your requirements and 
              prepare your personalized design. You will receive a notification at {userEmail} when your plan is ready.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your request has been sent to our support team at support@theplancave.com for review.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
              onClick={() => setSubmissionStatus('idle')}
            >
              Customize Another Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Selection Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">1</span>
                  Select a Base Plan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {housePlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
                        selectedPlan?.id === plan.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent'
                      }`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <div className="relative">
                        <img
                          src={plan.image}
                          alt={plan.name}
                          className="w-full h-48 object-cover"
                        />
                        {selectedPlan?.id === plan.id && (
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1">
                            Selected
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">${plan.basePrice}</span>
                          <Button
                            size="sm"
                            className={`${
                              selectedPlan?.id === plan.id
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.plan && <p className="text-red-500 mt-2">{errors.plan}</p>}
              </div>

              {/* Customization Section */}
              {selectedPlan && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">2</span>
                    Customize Your Plan
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="Plan Name"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="Enter a custom name for your plan"
                    />

                    <Input
                      type="email"
                      label="Your Email Address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="We'll send your design here"
                      error={errors.email}
                    />

                    <Input
                      type="number"
                      label="Number of Bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(parseInt(e.target.value) || 1)}
                      min="1"
                      max="10"
                    />

                    <Input
                      type="number"
                      label="Number of Bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(parseInt(e.target.value) || 1)}
                      min="1"
                      max="8"
                    />

                    <Input
                      type="number"
                      label="Number of Floors"
                      value={floors}
                      onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                      min="1"
                      max="5"
                    />

                    <Input
                      type="number"
                      label="Area (sqm)"
                      value={area}
                      onChange={(e) => setArea(parseInt(e.target.value) || 50)}
                      min="50"
                      max="1000"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Requirements or Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Share any specific requirements, preferences, or questions about your custom plan..."
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Price Summary & Action Panel */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <CardHeader className="border-b pb-4 bg-gradient-to-r from-blue-50 to-blue-100">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center">3</span>
                    Review & Submit
                  </h2>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {selectedPlan ? (
                    <>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <h3 className="font-semibold text-gray-900">{planName || selectedPlan.name}</h3>
                          <p className="text-sm text-gray-600">Base model: {selectedPlan.name}</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Base Plan</span>
                          <span className="font-medium">${selectedPlan.basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bedrooms ({bedrooms})</span>
                          <span className="font-medium">${(bedrooms * 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bathrooms ({bathrooms})</span>
                          <span className="font-medium">${(bathrooms * 800).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Floors ({floors})</span>
                          <span className="font-medium">${(floors * 2000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Area ({area} sqm)</span>
                          <span className="font-medium">${(area * 50).toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Estimated Cost</span>
                            <span className="text-2xl text-blue-600">${parseFloat(totalCost).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Final price may vary based on detailed requirements</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <Button
                          onClick={handleSubmitForReview}
                          disabled={submissionStatus === 'submitting'}
                          className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 relative overflow-hidden"
                        >
                          {submissionStatus === 'submitting' ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <EnvelopeIcon className="w-5 h-5 mr-2 inline" />
                              Submit Plan for Review
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={handleAddToCart}
                          variant="secondary"
                          className="w-full py-3 text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100"
                        >
                          Add to wishlist without review
                        </Button>
                      </div>
                      
                      {submissionStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                          <p className="text-sm">{submissionError || 'An error occurred. Please try again.'}</p>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600 border-t pt-4">
                        <p className="flex items-start mb-2">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Submit for review to get a personalized design from our architects</span>
                        </p>
                        <p className="flex items-start mb-2">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>You'll receive the finalized design via email</span>
                        </p>
                        <p className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>No payment required until you approve the final design</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">Select a plan to see pricing and submit for review.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-16">
        <ContactUs />
        <FooterSection />
      </div>
    </div>
  );
};

export default CustomPlansPage;