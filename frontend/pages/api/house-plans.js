import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('theplancave');
    
    // Extract query parameters
    const { minPrice, maxPrice, bedrooms, category } = req.query;
    
    // Build query object
    const query = {};
    
    // Price filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Bedrooms filtering
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }
    
    // Category filtering
    if (category) {
      query.category = category;
    }
    
    // Fetch plans with filters
    const housePlans = await db.collection('plans') // Changed from 'housePlans' to 'plans'
      .find(query)
      .sort({ createdAt: -1 }) // Newest first
      .toArray();
    
    // Transform the data to include proper image URLs
    const transformedPlans = housePlans.map(plan => ({
      id: plan._id,
      name: plan.name,
      // Use the primary render image or fallback to imageUrl
      image: plan.files?.renders?.[0]?.downloadURL || plan.imageUrl || '/default-plan.jpg',
      basePrice: plan.price,
      description: plan.description || '',
      defaultBedrooms: plan.bedrooms,
      defaultBathrooms: plan.bathrooms,
      defaultFloors: plan.floors,
      area: plan.area,
      style: plan.style,
      category: plan.category
    }));
    
    res.status(200).json(transformedPlans);
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch house plans' });
  }
}