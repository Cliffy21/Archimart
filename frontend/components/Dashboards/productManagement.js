import React, { useState } from 'react';
import { Package, Eye, Edit, Trash2, PlusCircle } from 'lucide-react';
import NewProductForm from '../../pages/admin/products/new'

const ProductManagement = ({ 
  role, 
  products, 
  filteredProducts, 
  formatCurrency, 
  handleDeleteProduct 
}) => {
  const [showForm, setShowForm] = useState(false);

  if (role !== 'admin') {
    return (
      <div className="text-center text-red-500 font-semibold py-8">
        Admin access required.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center">
          <Package size={20} className="text-blue-400 mr-2 sm:mr-3" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Product Management</h2>
            <p className="text-xs sm:text-sm text-slate-400">Manage your product inventory</p>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-6 bg-slate-900 border-b border-slate-700">
        <div className="bg-slate-800 border border-slate-700 p-2 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-slate-400">Total Products</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">{filteredProducts.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-2 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-slate-400">Active Listings</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400 mt-1">
            {filteredProducts.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-2 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-slate-400">Low Stock</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-400 mt-1">
            {filteredProducts.filter(p => p.stock < 3).length}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-2 sm:p-4 rounded-lg shadow-sm">
          <p className="text-xs sm:text-sm text-slate-400">Total Value</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-1">
            {formatCurrency(filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0))}
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-purple-900/30 rounded-2xl opacity-70"></div>
        
        <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {/* Header with glow effect */}
          <div className="relative bg-gradient-to-r from-slate-800/90 to-slate-700/80 border-b border-slate-600/50 p-4 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg shadow-lg">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Product Inventory</h3>
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Live inventory</span>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 hidden sm:table-header-group">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Product</span>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Price</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Stock</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, idx) => (
                    <tr 
                      key={product.id || idx} 
                      className="group relative hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20"
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      
                      {/* Mobile-first cell with enhanced styling */}
                      <td className="relative px-4 sm:px-6 py-6 sm:hidden block">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center">
                            <div className="relative flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-105">
                              <Package size={18} className="text-white" />
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors duration-300">
                                {product.name || `Product ${idx + 1}`}
                              </div>
                              <div className="text-sm text-slate-400 line-clamp-2 mt-1">
                                {product.description?.substring(0, 40) || 'No description available'}...
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-sm">
                              {product.category || 'Uncategorized'}
                            </span>
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm transition-all duration-300 ${
                              product.status === 'active' 
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-300 border-green-500/30' 
                                : 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30'
                            }`}>
                              {product.status || 'active'}
                            </span>
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm transition-all duration-300 ${
                              product.stock === 0 
                                ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-red-500/30' : 
                              product.stock < 3 
                                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-600/20 text-yellow-300 border-yellow-500/30' 
                                : 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-300 border-green-500/30'
                            }`}>
                              Stock: {product.stock || 0}
                            </span>
                            <span className="px-3 py-1.5 text-xs font-semibold text-blue-300 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-full border border-slate-500/30 backdrop-blur-sm">
                              {formatCurrency(product.price || 0)}
                            </span>
                          </div>
                          
                          <div className="flex justify-end space-x-2 pt-2">
                            <button 
                              className="relative p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn"
                              title="View Product"
                            >
                              <Eye size={16} />
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button 
                              className="relative p-2.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button 
                              className="relative p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn" 
                              title="Delete Product"
                              onClick={() => handleDeleteProduct(product.id, product.name || `Product ${idx + 1}`)}
                            >
                              <Trash2 size={16} />
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            </button>
                          </div>
                        </div>
                      </td>
                      
                      {/* Enhanced Desktop cells */}
                      <td className="relative px-4 sm:px-6 py-6 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-105">
                            <Package size={20} className="text-white" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors duration-300">
                              {product.name || `Product ${idx + 1}`}
                            </div>
                            <div className="text-sm text-slate-400 line-clamp-1 mt-1">
                              {product.description?.substring(0, 60) || 'No description available'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="relative px-4 sm:px-6 py-6 whitespace-nowrap hidden sm:table-cell">
                        <span className="px-3 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                          {product.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="relative px-4 sm:px-6 py-6 whitespace-nowrap text-slate-200 font-semibold text-base hidden sm:table-cell group-hover:text-blue-300 transition-colors duration-300">
                        {formatCurrency(product.price || 0)}
                      </td>
                      <td className="relative px-4 sm:px-6 py-6 whitespace-nowrap hidden sm:table-cell">
                        <span className={`px-3 py-2 inline-flex text-sm leading-5 font-semibold rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          product.stock === 0 
                            ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-red-500/30' : 
                          product.stock < 3 
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-600/20 text-yellow-300 border-yellow-500/30' 
                            : 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-300 border-green-500/30'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="relative px-4 sm:px-6 py-6 whitespace-nowrap hidden sm:table-cell">
                        <span className={`px-3 py-2 inline-flex text-sm leading-5 font-semibold rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          product.status === 'active' 
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-300 border-green-500/30' 
                            : 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30'
                        }`}>
                          {product.status || 'active'}
                        </span>
                      </td>
                      <td className="relative px-4 sm:px-6 py-6 whitespace-nowrap text-right text-sm font-medium hidden sm:table-cell">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="relative p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn"
                            title="View Product"
                          >
                            <Eye size={18} />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          </button>
                          <button 
                            className="relative p-2.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          </button>
                          <button 
                            className="relative p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn" 
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product.id, product.name || `Product ${idx + 1}`)}
                          >
                            <Trash2 size={18} />
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 sm:px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative p-6 bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-2xl mb-6 border border-slate-600/30">
                          <Package size={48} className="text-slate-500 mx-auto" />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                          Add your first product to start managing your inventory and boost your business.
                        </p>
                        <button 
                          className="relative group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105"
                          onClick={() => setShowForm(true)}
                        >
                          <PlusCircle size={18} className="mr-2" />
                          <span className="font-semibold">Add Your First Product</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {showForm && (
        <NewProductForm
          onClose={() => setShowForm(false)}
          onProductCreated={(newProduct) => {
            products(prev => [...prev, newProduct]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;