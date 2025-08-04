// pages/api/plans/index.js
import Plan from '../../../../Models/Plan';
import dbConnect from '../../../lib/mongodb';

export default async function handler(req, res) {
  await dbConnect();
  
  try {
    const { category, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (category === 'new-arrivals') {
      query.newArrival = true;
    } else if (category === 'best-sellers') {
      query.bestSeller = true;
    } else if (category) {
      query.category = category;
    }
    
    const plans = await Plan.find(query)
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Plan.countDocuments(query);
    
    res.status(200).json({ 
      success: true,
      data: plans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}