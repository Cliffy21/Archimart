
import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const productTypeOptions = [
  "Apartments",
  "Residentials",
  "Contemporary", 
  "Luxury villas",
  "Mansions",
  "Bungalow"
];

export default function Filters({ onFilterChange, isMobile = false }) {
  const [filters, setFilters] = useState({
    productTypes: [],
    bedrooms: "",
    minPrice: 0,
    maxPrice: 10000,
    minArea: "",
    floors: "",
    bathrooms: "",
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    let count = 0;
    if (filters.productTypes.length) count += 1;
    if (filters.bedrooms) count += 1;
    if (filters.minArea) count += 1;
    if (filters.floors) count += 1;
    if (filters.bathrooms) count += 1;
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count += 1;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleCheckboxChange = (value) => {
    setFilters((prev) => {
      const newTypes = prev.productTypes.includes(value)
        ? prev.productTypes.filter((type) => type !== value)
        : [...prev.productTypes, value];
      const newFilters = { ...prev, productTypes: newTypes };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (index, value) => {
    const numValue = parseInt(value) || 0;
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [index === 0 ? 'minPrice' : 'maxPrice']: numValue
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const resetFilters = {
      productTypes: [],
      bedrooms: "",
      minPrice: 0,
      maxPrice: 10000,
      minArea: "",
      floors: "",
      bathrooms: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Determine the appropriate class based on whether it's mobile view
  const containerClass = isMobile 
    ? "w-full bg-white rounded-lg shadow-sm p-4 z-50" 
    : "w-full max-w-[300px] bg-white rounded-lg shadow-sm p-4";

  return (
    <aside className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
            <X className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 text-sm bg-gray-100 rounded-full">
            {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} applied
          </span>
        </div>
      )}

      <div className="space-y-2">
        {/* Product Type Section */}
        <div className="border rounded-md">
          <button
            className="w-full px-4 py-2 flex justify-between items-center"
            onClick={() => toggleSection('productType')}
            type="button"
          >
            <span>Product Type</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${
              expandedSections.productType ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.productType && (
            <div className="p-4 border-t">
              {productTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={type}
                    checked={filters.productTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    className="rounded border-gray-300"
                  />
                  <label 
                    htmlFor={type} 
                    className="text-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCheckboxChange(type);
                    }}
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bedrooms Section */}
        <div className="border rounded-md">
          <button
            className="w-full px-4 py-2 flex justify-between items-center"
            onClick={() => toggleSection('bedrooms')}
            type="button"
          >
            <span>Bedrooms</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${
              expandedSections.bedrooms ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.bedrooms && (
            <div className="p-4 border-t">
              <input
                type="number"
                placeholder="Number of bedrooms"
                value={filters.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="border rounded-md">
          <button
            className="w-full px-4 py-2 flex justify-between items-center"
            onClick={() => toggleSection('price')}
            type="button"
          >
            <span>Price Range</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.price && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-1/2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Area Section */}
        <div className="border rounded-md">
          <button
            className="w-full px-4 py-2 flex justify-between items-center"
            onClick={() => toggleSection('area')}
            type="button"
          >
            <span>Area (SQM)</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${
              expandedSections.area ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.area && (
            <div className="p-4 border-t">
              <input
                type="number"
                placeholder="Minimum area"
                value={filters.minArea}
                onChange={(e) => handleInputChange("minArea", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Floors Section */}
        <div className="border rounded-md">
          <button
            className="w-full px-4 py-2 flex justify-between items-center"
            onClick={() => toggleSection('floors')}
            type="button"
          >
            <span>Floors</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${
              expandedSections.floors ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.floors && (
            <div className="p-4 border-t">
              <input
                type="number"
                placeholder="Number of floors"
                value={filters.floors}
                onChange={(e) => handleInputChange("floors", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Bathrooms Section */}
        <div className="border rounded-md">
          <button
            className="w-full px-4 py-2 flex justify-between items-center"
            onClick={() => toggleSection('bathrooms')}
            type="button"
          >
            <span>Bathrooms</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${
              expandedSections.bathrooms ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.bathrooms && (
            <div className="p-4 border-t">
              <input
                type="number"
                placeholder="Number of bathrooms"
                value={filters.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}