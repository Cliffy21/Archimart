import React from 'react';
import { 
  LineChart, 
  Line, 
  Area,
  AreaChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  BarChart3 
} from 'lucide-react';

const Revenue = ({ stats, revenueData, formatCurrency }) => {
  return (
    <div className="space-y-6">
      {/* Revenue Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Monthly Revenue Card */}
        <div className="relative group bg-gradient-to-br from-emerald-900/20 to-emerald-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white/90">Monthly Revenue</h3>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stats.revenueGrowth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {stats.revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
                </div>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="relative group bg-gradient-to-br from-blue-900/20 to-blue-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white/90">Avg Order Value</h3>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors duration-300">
                {formatCurrency(stats.totalRevenue / Math.max(stats.totalUsers, 1))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                  <Activity className="w-3 h-3" />
                  Stable
                </div>
                <span className="text-xs text-slate-400">per customer</span>
              </div>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="relative group bg-gradient-to-br from-purple-900/20 to-purple-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-300">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white/90">Conversion Rate</h3>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
                {((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100).toFixed(1)}%
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                  <Zap className="w-3 h-3" />
                  Optimized
                </div>
                <span className="text-xs text-slate-400">conversion</span>
              </div>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="relative group bg-gradient-to-br from-slate-900/60 to-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Revenue Trend</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    border: '1px solid #10b981',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5, stroke: '#065f46' }}
                  activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2, fill: '#065f46' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;