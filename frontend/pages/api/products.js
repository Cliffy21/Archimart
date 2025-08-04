import connectDB from '../../../config/db';
import Product from '../../../Models/Products'; // Ensure this matches the correct case
import { verifyToken, isAdmin } from '../../../middleware/auth'; // Ensure this matches the correct case

// Initialize database connection
connectDB();

export default async (req, res) => {
    const { method, query } = req;
    console.log(`🔹 API request received: ${method}`);

    switch (method) {
        case 'GET':
            try {
                // Extract filters from query parameters
                const { search, style, budget, size } = query;
                console.log('🔍 Filters:', query);

                let filters = {};

                // Search filter (case-insensitive)
                if (search) {
                    filters.name = { $regex: search, $options: 'i' };
                }

                // Style filter
                if (style) {
                    filters.style = style;
                }

                // Budget filter
                if (budget) {
                    if (budget === 'under-100') {
                        filters.price = { $lt: 100 };
                    } else if (budget === '100-300') {
                        filters.price = { $gte: 100, $lte: 300 };
                    } else if (budget === '300-500') {
                        filters.price = { $gte: 300, $lte: 500 };
                    } else if (budget === '500-700') {
                        filters.price = { $gte: 500, $lte: 700 };
                    } else if (budget === '700-plus') {
                        filters.price = { $gt: 700 };
                    }
                }

                // Size filter
                if (size) {
                    if (size === 'area') {
                        // Example: Filter by area (you can adjust this logic)
                        filters.size = { $gte: 1000 }; // Example: Minimum area of 1000 sq. ft.
                    } else if (size === 'bedrooms') {
                        filters.bedrooms = { $gte: 2 }; // Example: Minimum 2 bedrooms
                    } else if (size === 'bathrooms') {
                        filters.bathrooms = { $gte: 2 }; // Example: Minimum 2 bathrooms
                    } else if (size === 'floors') {
                        filters.floors = { $gte: 1 }; // Example: Minimum 1 floor
                    }
                }

                console.log('🛠 Filters applied:', filters);

                // Fetch products based on filters
                const products = await Product.find(filters);
                console.log('📦 Products found:', products);

                res.status(200).json({ success: true, products });
            } catch (error) {
                console.error('❌ Error fetching products:', error);
                res.status(500).json({ success: false, message: 'Server error' });
            }
            break;

        case 'POST':
            try {
                // Validate user permissions before creating a product
                await verifyToken(req, res);
                await isAdmin(req, res);

                console.log('📦 Creating new product...');
                const product = await Product.create(req.body);
                console.log('✅ Product created:', product);

                res.status(201).json({ success: true, data: product });
            } catch (error) {
                console.error('❌ Error creating product:', error);
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: 'Method Not Allowed' });
            break;
    }
};