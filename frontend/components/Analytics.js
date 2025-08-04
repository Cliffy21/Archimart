import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Target, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  MousePointer,
  Clock
} from 'lucide-react';

const ModernAnalytics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  // Mock data
  const usageData = [
    { date: 'Mon', users: 1200, sessions: 1850, pageViews: 3200 },
    { date: 'Tue', users: 1450, sessions: 2100, pageViews: 3800 },
    { date: 'Wed', users: 1680, sessions: 2400, pageViews: 4200 },
    { date: 'Thu', users: 1520, sessions: 2200, pageViews: 3900 },
    { date: 'Fri', users: 1800, sessions: 2600, pageViews: 4500 },
    { date: 'Sat', users: 1350, sessions: 1900, pageViews: 3300 },
    { date: 'Sun', users: 1100, sessions: 1600, pageViews: 2800 }
  ];

  const userDistributionData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 35, color: '#8b5cf6' },
    { name: 'Tablet', value: 20, color: '#06d6a0' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 40000 },
    { month: 'Feb', revenue: 52000, target: 45000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 60000 },
    { month: 'Jun', revenue: 67000, target: 65000 }
  ];

  const stats = {
    dailyActiveUsers: 1847,
    activeUsers: 12847,
    newUsersThisMonth: 2431,
    totalUsers: 15278,
    engagementRate: 84.1,
    avgSessionDuration: '4m 32s',
    bounceRate: 23.5,
    conversionRate: 3.2
  };

  const metrics = [
    {
      title: 'Daily Active Users',
      value: stats.dailyActiveUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Sessions',
      value: '24.7K',
      change: '+8.2%',
      changeType: 'positive',
      icon: Activity,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Avg Session Duration',
      value: stats.avgSessionDuration,
      change: '+2.1%',
      changeType: 'positive',
      icon: Clock,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '-0.3%',
      changeType: 'negative',
      icon: Target,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cycle through metrics for the hero card
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const AnimatedCard = ({ children, delay = 0, className = "" }) => (
    <div
      className={`
        transform transition-all duration-700 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'
        }
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  const MetricCard = ({ metric, index, isActive = false }) => {
    const IconComponent = metric.icon;
    
    return (
      <div
        className={`
          group relative overflow-hidden
          bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-600/70
          backdrop-blur-sm border border-slate-700/50
          rounded-2xl p-6 shadow-lg
          hover:shadow-2xl hover:shadow-slate-900/25
          hover:border-slate-600/80 hover:scale-[1.02]
          transition-all duration-500 ease-out
          cursor-pointer
          ${isActive ? 'ring-2 ring-blue-500/50 shadow-blue-500/25' : ''}
        `}
        onClick={() => setActiveMetric(index)}
      >
        {/* Animated background gradient */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
          bg-gradient-to-br ${metric.gradient}
        `} />
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient}
              flex items-center justify-center shadow-lg
              group-hover:scale-110 group-hover:rotate-3
              transition-all duration-300
            `}>
              <IconComponent size={24} className="text-white" />
            </div>
            
            <div className={`
              flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium
              ${metric.changeType === 'positive' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
              }
            `}>
              {metric.changeType === 'positive' ? (
                <ArrowUp size={12} />
              ) : (
                <ArrowDown size={12} />
              )}
              <span>{metric.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
              {metric.title}
            </h3>
            <div className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
              {metric.value}
            </div>
          </div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      </div>
    );
  };

  const ChartCard = ({ title, children, delay = 0, className = "" }) => (
    <AnimatedCard delay={delay} className={className}>
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-600/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-slate-600/80 transition-all duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">
            {title}
          </h3>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
        
        {/* Chart Content */}
        <div className="relative">
          {children}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-blue-500 via-purple-500 to-transparent rounded-2xl pointer-events-none" />
      </div>
    </AnimatedCard>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-2xl">
          <p className="text-slate-300 text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white font-medium">
                {entry.name}: {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">
      {/* Hero Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <AnimatedCard key={index} delay={index * 100}>
            <MetricCard 
              metric={metric} 
              index={index}
              isActive={activeMetric === index}
            />
          </AnimatedCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Daily Active Users Chart */}
        <ChartCard title="Daily Active Users Trend" delay={400}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#cbd5e1" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#cbd5e1" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#userGradient)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* User Distribution Chart */}
        <ChartCard title="Traffic Sources Distribution" delay={500}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-2xl">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: data.color }}
                            />
                            <span className="text-white font-medium">
                              {data.name}: {data.value}%
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#e2e8f0' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Revenue vs Target Chart */}
      <ChartCard title="Revenue Performance vs Target" delay={600} className="col-span-full">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#cbd5e1" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#cbd5e1" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="target" 
                fill="#64748b" 
                radius={[4, 4, 0, 0]}
                opacity={0.6}
                name="Target"
              />
              <Bar 
                dataKey="revenue" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Additional Analytics Overview */}
      <AnimatedCard delay={700}>
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-600/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-8 flex items-center space-x-3">
            <TrendingUp className="text-blue-400" size={24} />
            <span>Performance Insights</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Eye size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                {stats.dailyActiveUsers.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300">Page Views Today</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {stats.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300">Active Users</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <MousePointer size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {stats.newUsersThisMonth.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300">New Users This Month</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Target size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {stats.engagementRate}%
              </div>
              <div className="text-sm text-slate-300">Engagement Rate</div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ModernAnalytics;