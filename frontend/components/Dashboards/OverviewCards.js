import React, { useState, useEffect } from 'react';
import {
  Users, ShoppingBag, DollarSign, TrendingUp
} from 'lucide-react';

const OverviewCards = ({ stats = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Use provided stats or fallback to mock data
  const cardStats = stats || {
    totalUsers: "12,847",
    totalProducts: "3,456", 
    totalRevenue: 284750,
    revenueGrowth: 23.5
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const cardData = [
    {
      title: "Total Users",
      value: cardStats.totalUsers,
      icon: Users,
      color: "blue",
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      hoverGlow: "hover:shadow-blue-500/25"
    },
    {
      title: "Total Products", 
      value: cardStats.totalProducts,
      icon: ShoppingBag,
      color: "indigo",
      gradient: "from-indigo-500/20 via-indigo-600/10 to-transparent",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      hoverGlow: "hover:shadow-indigo-500/25"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(cardStats.totalRevenue),
      icon: DollarSign,
      color: "green", 
      gradient: "from-green-500/20 via-green-600/10 to-transparent",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      hoverGlow: "hover:shadow-green-500/25"
    },
    {
      title: "Revenue Growth",
      value: `${cardStats.revenueGrowth}%`,
      icon: TrendingUp,
      color: "yellow",
      gradient: "from-yellow-500/20 via-yellow-600/10 to-transparent", 
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      hoverGlow: "hover:shadow-yellow-500/25"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <div
            key={index}
            className={`
              group relative overflow-hidden
              bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-600/70
              backdrop-blur-sm border border-slate-700/50
              rounded-xl shadow-lg
              transition-all duration-500 ease-out
              hover:scale-[1.02] hover:shadow-2xl
              hover:border-slate-600/80
              ${card.hoverGlow}
              transform
              ${isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
              }
            `}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            {/* Animated background gradient overlay */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-br ${card.gradient}
              transition-opacity duration-500
            `} />
            
            {/* Subtle animated border glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${card.gradient} blur-sm`} />
            </div>
            
            {/* Card content */}
            <div className="relative p-4 sm:p-6 flex items-center">
              {/* Icon container with enhanced animations */}
              <div className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full
                ${card.iconBg} backdrop-blur-sm
                flex items-center justify-center mr-3 sm:mr-4
                transition-all duration-300 ease-out
                group-hover:scale-110 group-hover:rotate-3
                shadow-lg group-hover:shadow-xl
              `}>
                <IconComponent 
                  size={24} 
                  className={`
                    ${card.iconColor} 
                    transition-all duration-300
                    group-hover:scale-110
                    sm:w-7 sm:h-7
                  `} 
                />
              </div>
              
              {/* Text content with staggered animations */}
              <div className="flex-1 min-w-0">
                <div className={`
                  text-slate-300 text-xs sm:text-sm font-medium
                  transition-all duration-300
                  group-hover:text-slate-200
                  group-hover:translate-x-1
                `}>
                  {card.title}
                </div>
                
                <div className={`
                  text-lg sm:text-2xl font-bold text-white mt-1
                  transition-all duration-300 ease-out
                  group-hover:scale-105 group-hover:translate-x-1
                  truncate
                `}>
                  {card.value}
                </div>
              </div>
            </div>
            
            {/* Subtle shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;