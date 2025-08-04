
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../components/admin/Sidebar';
import { flaskApi } from '../../../axios'; // Make sure this path is correct

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('flask_token'); // Use the Flask JWT token

      if (!token) {
        setError('You must be logged in to view this page');
        return;
      }

      // Fetch product details from Flask backend
      const response = await flaskApi.get(`/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProduct(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('flask_token');
        await flaskApi.delete(`/admin/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert('Product deleted successfully');
        router.push('/admin/products');
      } catch (err) {
        alert('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/admin/products/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-red-500">{error}</div>
            <button
              onClick={() => router.push('/admin/products')}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div>Product not found</div>
            <button
              onClick={() => router.push('/admin/products')}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
            <button
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Back to Products
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-64 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h2 className="text-xl font-bold mb-4">{product.name}</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">${product.price?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">In Stock</p>
                    <p className="font-semibold">{product.countInStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="font-semibold">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold">{product.category}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
