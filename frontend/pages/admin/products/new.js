import React, { useState, useEffect } from 'react';
import {  X, Package } from 'lucide-react';
import { toast } from 'react-toastify';

const NewProductModal = ({ onClose, onProductCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    bedrooms: '',
    category: '',
    bathrooms: '',
    area: '',
    image: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update image preview
    if (name === 'image') {
      setPreviewUrl(value);
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';

    if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms is required';
    else if (isNaN(formData.bedrooms) || Number(formData.bedrooms) < 0 || !Number.isInteger(Number(formData.bedrooms)))
      newErrors.bedrooms = 'Bedrooms must be a non-negative integer';

    if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms is required';
    else if (isNaN(formData.bathrooms) || Number(formData.bathrooms) < 0 || !Number.isInteger(Number(formData.bathrooms)))
      newErrors.bathrooms = 'Bathrooms must be a non-negative integer';

    if (!formData.area) newErrors.area = 'Area is required';
    else if (isNaN(formData.area) || Number(formData.area) <= 0)
      newErrors.area = 'Area must be a positive number';

    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('flask_token');
      if (!token) {
        toast.error('You must be logged in to create a product');
        return;
      }

      // Use flaskApi and POST to /admin/products
      const response = await flaskApi.post(
        '/admin/products',
        {
          ...formData,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          area: Number(formData.area)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Product created successfully!');
      onProductCreated(response.data.product);
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while creating the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Categories for dropdown
  const categories = [
    "Apartment", "Villa", "Residential", , "Penthouse", 
    "Duplex", "Bungalow", "Mansion", "Cottage", "Contemporary"
  ];

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'}
    `}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeModal}
      />
      
      {/* Modal container */}
      <div className={`
        relative bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package size={24} className="mr-2 text-blue-500" />
            Add Plan
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Luxury Beachfront Villa"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.name}</p>}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.price ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.price}</p>}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.category ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.category}</p>}
                </div>

                {/* Bedrooms */}
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.bedrooms ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0"
                  />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.bedrooms}</p>}
                </div>

                {/* Bathrooms */}
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.bathrooms ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0"
                  />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.bathrooms}</p>}
                </div>

                {/* Area */}
                <div className="md:col-span-2">
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.area ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0"
                  />
                  {errors.area && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.area}</p>}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.image ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="https://example.com/property-image.jpg"
                  />
                  {errors.image && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.image}</p>}
                </div>
                {/* Video URL */}
                <div className="md:col-span-2">
                  <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                    Walkthrough video URL (MP4)
                  </label>
                  <input
                    type="text"
                    id="video"
                    name="video"
                    value={formData.video || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.video ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="https://example.com/property-video.mp4"
                  />
                  {errors.video && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.video}</p>}
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      errors.description ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Describe the property features, location, and amenities..."
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.description}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 hover:shadow-md"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center disabled:opacity-70 transition-all duration-200 hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Package size={18} className="mr-2" />
                      Add Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Property Preview</h3>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Property preview"
                    className="rounded-lg w-full h-64 object-cover mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                    Image Preview
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm text-gray-500">Property Name</h4>
                    <p className="font-medium">{formData.name || "Luxury Property"}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Price</h4>
                      <p className="font-medium">
                        {formData.price ? `$${Number(formData.price).toLocaleString()}` : "$0"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Bedrooms</h4>
                      <p className="font-medium">{formData.bedrooms || "0"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Bathrooms</h4>
                      <p className="font-medium">{formData.bathrooms || "0"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500">Area</h4>
                    <p className="font-medium">
                      {formData.area ? `${Number(formData.area).toLocaleString()} sq ft` : "0 sq ft"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500">Category</h4>
                    <p className="font-medium">{formData.category || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500">Status</h4>
                    <p className={`font-medium ${
                      formData.status === 'active' ? 'text-green-600' : 
                      formData.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {formData.status ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1) : "Active"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default NewProductModal;