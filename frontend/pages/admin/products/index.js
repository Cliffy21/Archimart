
import { useEffect, useState } from 'react';
import { flaskApi } from '../../../axios'; // Adjust path if needed
import Sidebar from '/home/badman/ThePlanCave/frontend/components/admin/Sidebar.js';
import ProductCard from '/home/badman/ThePlanCave/frontend/components/admin/ProductCard.js';
import Link from 'next/link';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('flask_token');
        if (!token) {
          setError('You must be logged in to view products.');
          setLoading(false);
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await flaskApi.get('/admin/products', config);
        // If Flask returns an array directly
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Products</h2>
          <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <ProductCard
                key={product.id || product._id}
                title={product.name}
                price={product.price}
                id={product.id || product._id}
                imageUrl={product.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
