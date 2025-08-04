import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Mail, 
  RefreshCw, 
  Moon, 
  Sun, 
  User, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const SettingsComponent = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoRefresh: false,
    darkMode: true,
    displayName: 'John Doe',
    email: 'john.doe@example.com'
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
  const [isDirty, setIsDirty] = useState(false);

  // Load settings from backend on component mount
  useEffect(() => {
  loadSettings();
}, []); // Only run once on mount

const loadSettings = async () => {
  try {
    setLoading(true);
    const response = await fetch('/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      setSettings(data);
      applyTheme(data.darkMode);
    } else {
      console.error('Failed to load settings');
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  } finally {
    setLoading(false);
  }
};

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setIsDirty(true);
    setSaveStatus(null);
  };

  const applyTheme = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const handleThemeToggle = () => {
    const newDarkMode = !settings.darkMode;
    updateSettings({ darkMode: newDarkMode });
    applyTheme(newDarkMode);
  };

  const saveSettings = async () => {
    if (!isDirty) return;

    try {
      setLoading(true);
      setSaveStatus(null);

      const response = await fetch('/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
           'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        setIsDirty(false);
        setSaveStatus('success');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        console.error('Failed to save settings');
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`
        relative w-12 h-6 rounded-full transition-all duration-300 ease-out
        ${checked 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
          : 'bg-slate-600 shadow-inner'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        peer-focus:ring-4 peer-focus:ring-blue-500/20
      `}>
        <div className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg
          transition-all duration-300 ease-out transform
          ${checked ? 'translate-x-6 shadow-xl' : 'translate-x-0'}
        `} />
      </div>
    </label>
  );

  const SettingCard = ({ icon: Icon, title, description, children, delay = 0 }) => (
    <div 
      className={`
        group relative overflow-hidden
        bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-600/70
        backdrop-blur-sm border border-slate-700/50
        rounded-xl p-6 shadow-lg
        hover:shadow-2xl hover:shadow-slate-900/20
        hover:border-slate-600/80
        transition-all duration-500 ease-out
        transform hover:scale-[1.01]
        animate-fadeInUp
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-xl" />
      </div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  if (loading && !settings.email) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Save Status Banner */}
      {saveStatus && (
        <div className={`
          p-4 rounded-xl border transition-all duration-300 animate-slideDown
          ${saveStatus === 'success' 
            ? 'bg-green-50/10 border-green-500/30 text-green-400' 
            : 'bg-red-50/10 border-red-500/30 text-red-400'
          }
        `}>
          <div className="flex items-center space-x-3">
            {saveStatus === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">
              {saveStatus === 'success' 
                ? 'Settings saved successfully!' 
                : 'Failed to save settings. Please try again.'
              }
            </span>
          </div>
        </div>
      )}

      {/* Dashboard Preferences */}
      <SettingCard 
        icon={Settings}
        title="Dashboard Preferences"
        description="Customize your dashboard experience"
        delay={0}
      >
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-slate-400" />
              <div>
                <h4 className="font-medium text-slate-200">Email Notifications</h4>
                <p className="text-sm text-slate-400">Receive email alerts for important updates</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.emailNotifications}
              onChange={() => updateSettings({ emailNotifications: !settings.emailNotifications })}
              disabled={loading}
            />
          </div>

          {/* Auto Refresh */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <RefreshCw size={18} className="text-slate-400" />
              <div>
                <h4 className="font-medium text-slate-200">Auto Refresh</h4>
                <p className="text-sm text-slate-400">Automatically refresh dashboard data every 30 seconds</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.autoRefresh}
              onChange={() => updateSettings({ autoRefresh: !settings.autoRefresh })}
              disabled={loading}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              {settings.darkMode ? (
                <Moon size={18} className="text-slate-400" />
              ) : (
                <Sun size={18} className="text-slate-400" />
              )}
              <div>
                <h4 className="font-medium text-slate-200">Dark Mode</h4>
                <p className="text-sm text-slate-400">Switch between light and dark interface themes</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.darkMode}
              onChange={handleThemeToggle}
              disabled={loading}
            />
          </div>
        </div>
      </SettingCard>

      {/* Account Information */}
      <SettingCard 
        icon={User}
        title="Account Information"
        description="Manage your personal account details"
        delay={100}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Display Name
            </label>
            <input
              type="text"
              className="
                w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                transition-all duration-200 hover:bg-slate-700/70
                placeholder-slate-400
              "
              value={settings.displayName}
              onChange={e => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Enter your display name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Email Address
            </label>
            <input
              type="email"
              className="
                w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                transition-all duration-200 hover:bg-slate-700/70
                placeholder-slate-400
              "
              value={settings.email}
              onChange={(e) => updateSettings({ email: e.target.value })}
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>
        </div>
      </SettingCard>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          className={`
            group relative px-8 py-3 rounded-xl font-medium transition-all duration-300
            flex items-center space-x-3 min-w-[140px] justify-center
            ${isDirty 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
              : 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
            }
            ${loading ? 'cursor-not-allowed' : ''}
          `}
          onClick={saveSettings}
          disabled={!isDirty || loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} className={isDirty ? 'group-hover:scale-110 transition-transform' : ''} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SettingsComponent;