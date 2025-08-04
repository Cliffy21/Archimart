import React from 'react';
import {
  BarChart2,
  Users,
  Package,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Home,
  FileText,
  ShoppingCart,
  Brush,
  LayoutDashboard
} from 'lucide-react';

const DashboardSidebar = ({
  isCollapsed = false,
  setIsCollapsed = () => {},
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
  activeTab = 'overview',
  setActiveTab = () => {},
  session = {},
  handleLogout = () => {},
}) => {
  // Get user role from session or default to 'customer'
  const userRole = session?.user?.role || 'customer';

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { 
        icon: LayoutDashboard, 
        label: "Overview", 
        key: "overview",
        roles: ['admin', 'designer', 'customer']
      }
    ];

    const adminItems = [
      { icon: Users, label: "Users", key: "users", roles: ['admin'] },
      { icon: Package, label: "All Plans", key: "plans", roles: ['admin'] },
      { icon: DollarSign, label: "Revenue", key: "revenue", roles: ['admin'] },
      { icon: BarChart2, label: "Analytics", key: "analytics", roles: ['admin'] }
    ];

    const designerItems = [
      { icon: Brush, label: "My Plans", key: "my-plans", roles: ['designer'] },
      { icon: FileText, label: "Earnings", key: "earnings", roles: ['designer'] }
    ];

    const customerItems = [
      { icon: ShoppingCart, label: "Marketplace", key: "marketplace", roles: ['customer'] },
      { icon: FileText, label: "My Plans", key: "purchased", roles: ['customer'] }
    ];

    const settingsItem = { 
      icon: Settings, 
      label: "Settings", 
      key: "settings",
      roles: ['admin', 'designer', 'customer']
    };

    return [
      ...baseItems,
      ...(userRole === 'admin' ? adminItems : []),
      ...(userRole === 'designer' ? designerItems : []),
      ...(userRole === 'customer' ? customerItems : []),
      settingsItem
    ].filter(item => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
        text-white fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out 
        shadow-2xl border-r border-slate-700
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} 
        lg:translate-x-0 w-64
      `}>
        
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b border-slate-700/50 
          bg-slate-800/50 backdrop-blur-sm
          ${isCollapsed ? 'lg:justify-center' : ''}
        `}>
          <div className={`transition-all duration-300 ${isCollapsed ? 'lg:hidden' : 'flex items-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">
                {userRole.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {userRole === 'admin' ? 'Admin' : userRole === 'designer' ? 'Designer' : 'My Account'}
            </span>
          </div>
          
          {/* Mobile close button */}
          <button
            className="lg:hidden text-white hover:bg-slate-700 p-1 rounded-lg transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            X
          </button>
          
          {/* Desktop collapse toggle */}
          <button
            className="hidden lg:block text-slate-400 hover:text-white hover:bg-slate-700 p-1 rounded-lg transition-all duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b border-slate-700/50 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800" />
            </div>
            <div className={`ml-3 transition-all duration-300 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
              <div className="font-medium text-white">
                {session?.user?.username || 'Guest User'}
              </div>
              <div className="text-xs text-slate-400 capitalize">
                {userRole}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.key;
              
              return (
                <button
                  key={item.key}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 rounded-lg text-left 
                    transition-all duration-200 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }
                  `}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full" />
                  )}
                  
                  <div className="flex items-center min-w-0 flex-1">
                    <IconComponent 
                      size={18} 
                      className={`
                        flex-shrink-0 transition-transform duration-200 
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      `} 
                    />
                    <span className={`
                      ml-3 font-medium transition-all duration-300 
                      ${isCollapsed ? 'lg:hidden' : 'block'}
                    `}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t border-slate-700/50 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <button 
            className={`
              flex items-center w-full px-3 py-3 text-slate-300 
              hover:text-white hover:bg-red-600/20 rounded-lg 
              transition-all duration-200 group 
              ${isCollapsed ? 'lg:justify-center' : ''}
            `}
            onClick={handleLogout}
          >
            <LogOut size={18} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
            <span className={`
              ml-3 font-medium transition-all duration-300 
              ${isCollapsed ? 'lg:hidden' : 'block'}
            `}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;