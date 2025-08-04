import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign, Info, ArrowLeft, Calculator } from 'lucide-react';


// Mock data - replace with actual API calls in production
const costFactors = [
  { id: 1, name: 'Location', description: 'Construction costs vary significantly by location due to differences in labor costs, material availability, and local regulations.' },
  { id: 2, name: 'Size', description: 'The total square footage is a primary factor in determining construction costs.' },
  { id: 3, name: 'Materials', description: 'The quality and type of materials used significantly impact the overall cost.' },
  { id: 4, name: 'Complexity', description: 'Unique or complex designs require more labor and specialized skills.' },
  { id: 5, name: 'Finishes', description: 'High-end finishes and fixtures increase costs but can add significant value.' },
];

const designStyles = [
  { id: 1, name: 'Modern', costFactor: 1.2, description: 'Clean lines, minimal ornamentation, open floor plans' },
  { id: 2, name: 'Contemporary', costFactor: 1.15, description: 'Current trends, innovative materials, energy efficiency' },
  { id: 3, name: 'Bungalow', costFactor: 1.1, description: 'Simplicity, functionality, limited color palette' },
  { id: 4, name: 'Residentials', costFactor: 1.25, description: 'Exposed elements, raw materials, utilitarian aesthetic' },
  { id: 5, name: 'Mansions', costFactor: 1.3, description: 'Classic details, symmetry, familiar forms' },
  { id: 6, name: 'Luxury Villas', costFactor: 1.2, description: 'Light colors, natural materials, functional design' },
];

const regions = [
  { id: 1, name: 'Kenya', costFactor: 1.4 },
  { id: 2, name: 'Tanzania', costFactor: 1.1 },
  { id: 3, name: 'Uganda', costFactor: 1.2 },
  { id: 4, name: 'South Sudan', costFactor: 1.15 },
  { id: 5, name: 'West Africa', costFactor: 1.5 },
  { id: 6, name: 'South Africa', costFactor: 1.3 },
];

// Base cost per square foot (national average)
const BASE_COST_PER_SQFT = 150;

const CostFactorCard = ({ factor }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-xl font-semibold mb-2">{factor.name}</h3>
      <p className="text-gray-600">{factor.description}</p>
    </motion.div>
  );
};

const CostCalculator = () => {
  const [squareFootage, setSquareFootage] = useState(2000);
  const [selectedRegion, setSelectedRegion] = useState(3); // Default to Midwest
  const [selectedStyle, setSelectedStyle] = useState(1); // Default to Modern
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateCost();
  }, [squareFootage, selectedRegion, selectedStyle]);

  const calculateCost = () => {
    const region = regions.find(r => r.id === selectedRegion);
    const style = designStyles.find(s => s.id === selectedStyle);
    
    if (!region || !style) return;
    
    const regionFactor = region.costFactor;
    const styleFactor = style.costFactor;
    
    const totalCost = squareFootage * BASE_COST_PER_SQFT * regionFactor * styleFactor;
    setEstimatedCost(totalCost);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <Calculator size={24} className="text-primary mr-2" />
        <h2 className="text-2xl font-bold">Cost Calculator</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Square Footage</label>
          <input
            type="range"
            min="200"
            max="10000"
            step="100"
            value={squareFootage}
            onChange={(e) => setSquareFootage(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">{squareFootage} sq ft</span>
            <input
              type="number"
              value={squareFootage}
              onChange={(e) => setSquareFootage(parseInt(e.target.value) || 0)}
              className="w-24 border rounded px-2 py-1 text-right"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(parseInt(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name} (Factor: {region.costFactor.toFixed(2)}x)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Design Style</label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(parseInt(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {designStyles.map(style => (
              <option key={style.id} value={style.id}>
                {style.name} (Factor: {style.costFactor.toFixed(2)}x)
              </option>
            ))}
          </select>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Estimated Cost:</h3>
            <span className="text-2xl font-bold text-primary">
              ${estimatedCost.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-600 mt-2 flex items-center hover:text-primary"
          >
            {showDetails ? 'Hide' : 'Show'} calculation details
            <Info size={16} className="ml-1" />
          </button>
          
          {showDetails && (
            <motion.div 
              className="mt-3 text-sm text-gray-600 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <p>Base cost: ${BASE_COST_PER_SQFT}/sq ft</p>
              <p>Square footage: {squareFootage} sq ft</p>
              <p>Region factor: {regions.find(r => r.id === selectedRegion)?.costFactor.toFixed(2)}x</p>
              <p>Style factor: {designStyles.find(s => s.id === selectedStyle)?.costFactor.toFixed(2)}x</p>
              <p className="pt-1 border-t">
                Calculation: ${BASE_COST_PER_SQFT} × {squareFootage} × {regions.find(r => r.id === selectedRegion)?.costFactor.toFixed(2)} × {designStyles.find(s => s.id === selectedStyle)?.costFactor.toFixed(2)} = ${estimatedCost.toLocaleString()}
              </p>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>* This is an estimate only. Actual costs may vary based on specific requirements, local conditions, and market fluctuations.</p>
      </div>
    </motion.div>
  );
};

const DesignCosts = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Design Costs | Learn</title>
        <meta name="description" content="Understand the costs associated with different building designs" />
      </Head>

    

      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link href="/learn/building-designs">
          
            <ArrowLeft size={16} className="mr-1" /> Back to Building Designs
          
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative h-64 mb-12 rounded-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <img 
          src="/4.jpg" 
          alt="Design Costs" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Design Costs
          </h1>
          <p className="text-white text-xl max-w-2xl">
            Understand the factors that influence building costs and estimate your project budget
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cost Factors */}
        <div className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <DollarSign size={28} className="text-primary mr-2" />
              Cost Factors
            </h2>
            <p className="text-gray-700 mb-8">
              Building costs can vary significantly based on several key factors. Understanding these factors will help you make informed decisions about your project and budget effectively.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {costFactors.map(factor => (
                <CostFactorCard key={factor.id} factor={factor} />
              ))}
            </div>
          </section>
          
          {/* Design Style Costs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Design Style Impact</h2>
            <p className="text-gray-700 mb-8">
              Different architectural styles have varying cost implications due to materials, complexity, and labor requirements.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Style</th>
                    <th className="py-3 px-4 text-left">Cost Factor</th>
                    <th className="py-3 px-4 text-left">Characteristics</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {designStyles.map(style => (
                    <tr key={style.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{style.name}</td>
                      <td className="py-3 px-4">{style.costFactor.toFixed(2)}x</td>
                      <td className="py-3 px-4">{style.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Regional Cost Variations */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Regional Variations</h2>
            <p className="text-gray-700 mb-8">
              Construction costs can vary significantly by region due to differences in labor costs, material availability, and local regulations.
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {regions.map(region => (
                  <div key={region.id} className="text-center p-4 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">{region.name}</h3>
                    <div className="text-2xl font-bold text-primary">{region.costFactor.toFixed(2)}x</div>
                    <p className="text-sm text-gray-600 mt-1">Cost Factor</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        
        {/* Right Column - Cost Calculator */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CostCalculator />
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <section className="mt-16 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">How accurate are these cost estimates?</h3>
            <p className="text-gray-700">
             Our cost estimates provide a general guideline based on national averages and regional factors. They are intended to give you a starting point for budgeting purposes. For a more accurate estimate, we recommend consulting with local contractors or architects who can assess your specific project requirements.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Do these estimates include all construction costs?</h3>
            <p className="text-gray-700">
              The estimates include basic construction costs but may not account for site preparation, permits, architectural fees, interior design, landscaping, or other specialized requirements. These additional costs can add 15-30% to the total project budget.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">How do material choices affect the overall cost?</h3>
            <p className="text-gray-700">
              Material selection can significantly impact your budget. Premium materials like natural stone, hardwood, and custom fixtures will increase costs, while standard materials offer more budget-friendly options. The calculator accounts for typical material costs associated with each design style, but specific material choices may result in higher or lower actual costs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">How often are these cost factors updated?</h3>
            <p className="text-gray-700">
              We review and update our cost factors quarterly to reflect current market conditions and construction trends. However, the construction industry can experience rapid price fluctuations due to material shortages, labor availability, and economic factors, so it's always advisable to verify current costs in your specific area.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gray-100 rounded-xl p-8 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Explore our building designs and find the perfect match for your needs and budget.
        </p>
        <Link href="/learn/building-designs">
        
            View Building Designs
        
        </Link>
      </section>
    </div>
  );
};

export default DesignCosts;