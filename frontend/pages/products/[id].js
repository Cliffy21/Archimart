import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Navbar from 'components/Navbar';
import FooterSection from 'components/FooterSection';
import FeaturedPlans from 'components/FeaturedPlans';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [featuredPlans, setFeaturedPlans] = useState([]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedPlans = async () => {
        try {
            const response = await fetch('/api/products/featured');
            const data = await response.json();
            setFeaturedPlans(data);
        } catch (error) {
            console.error('Error fetching featured plans:', error);
        }
    };

    const handleCustomization = () => {
        // Store product in localStorage or pass via query params
        localStorage.setItem('customizingProduct', JSON.stringify(product));
        router.push('/custom-plans');
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchProduct();
            fetchFeaturedPlans();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link href="/all-products" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{product.name} | The Plan Cave</title>
                <meta name="description" content={`Details for ${product.name}`} />
            </Head>

            <Navbar /> 

            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-start h-16 items-center">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center">
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Existing product details */}
                        <div className="space-y-4">
                            {/* Image gallery */}
                        </div>

                        <div className="space-y-6">
                            {/* Product details */}
                            
                            {/* Customization Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Customization Options</h3>
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleCustomization}
                                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Customize This Plan
                                    </button>
                                    <p className="text-sm text-gray-500">
                                        Want to modify this plan? Click above to start customizing it to your needs.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                    Buy Now
                                </button>
                                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Plans Section */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-8">Similar Plans You Might Like</h2>
                        <FeaturedPlans plans={featuredPlans} />
                    </section>
                </main>
            </div>

            <FooterSection /> {/* Added Footer */}
        </>
    );
}