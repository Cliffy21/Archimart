import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import styles from '../styles/Search.module.css'; // Assuming you have a CSS module for search

// Configure axios with base URL
// This ensures all axios requests are made to your backend server
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SearchPage = () => {
    const router = useRouter();
    const { query } = router.query;  // Get search term from URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState('name'); // Default sort field
    const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return; // Stop if no query
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log(`🔍 Fetching products for: ${query}`);

                // Send search term, sort field, and sort direction as query parameters
                const response = await axios.get(`/api/search`, {
                    params: {
                        q: query,
                        sortField: sortField,
                        sortDirection: sortDirection
                    }
                });

                console.log("📦 Products received:", response.data);

                setProducts(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
            } catch (error) {
                console.error("❌ Error fetching search results:", error);
                setError(`Error fetching search results: ${error.message}`);
                setProducts([]); // Set to empty if error occurs
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, sortField, sortDirection]); // Run when query, sortField, or sortDirection changes

    const handleSortChange = (field) => {
        if (sortField === field) {
            // Toggle sort direction if the same field is selected
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort field and default to ascending direction
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className={styles.searchPageContainer}>
            <Navbar />

            <div className={styles.searchContent}>
                <h2 className={styles.searchTitle}>
                    {query ? `Search Results for: ${query}` : 'Enter a search term'}
                </h2>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                        <button 
                            className={styles.retryButton}
                            onClick={() => router.reload()}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {query && (
                    <div className={styles.sortControls}>
                        <label>Sort by: </label>
                        <select 
                            onChange={(e) => handleSortChange(e.target.value)} 
                            value={sortField}
                            className={styles.sortSelect}
                        >
                            <option value="name">Name</option>
                            <option value="category">Category</option>
                            <option value="bathrooms">Bathrooms</option>
                            <option value="bedrooms">Bedrooms</option>
                            <option value="floors">Floors</option>
                            <option value="area">Area</option>
                        </select>
                        <button 
                            className={styles.sortDirectionButton}
                            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        >
                            {sortDirection === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading search results...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className={styles.productsGrid}>
                        {products.map((product) => (
                            <ProductCard 
                                key={product._id || product.id || `product-${Math.random()}`} 
                                product={product} 
                            />
                        ))}
                    </div>
                ) : query ? (
                    <div className={styles.noResults}>
                        <p>No products found matching "{query}".</p>
                        <p>Try using different keywords or browse our categories.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SearchPage;