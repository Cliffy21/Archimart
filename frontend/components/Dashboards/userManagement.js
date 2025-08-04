import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import {
  Users, Mail, Calendar, UserPlus, PenTool, Shield, Activity,
  User, X, UserPlus as UserPlusIcon, Edit, Trash2, Eye
} from 'lucide-react';
import { flaskApi } from '../../axios';
import { getAccessToken } from '../../utils/auth.js';

const Tooltip = ({ content, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
      {content}
    </div>
  </div>
);

const ViewUserModal = ({ user, setShowViewUserModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowViewUserModal(false), 300);
  };

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'}
    `}>
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeModal}
      />
      
      <div className={`
        relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Eye className="mr-2" size={24} />
            User Details
          </h2>
          <button 
            onClick={closeModal}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
              {(user.username || user.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                {user.username || user.name || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                {user.email || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                user.role === 'designer' ? 'bg-blue-500/20 text-blue-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {user.role === 'admin' && <Shield size={16} className="mr-2" />}
                {user.role === 'designer' && <PenTool size={16} className="mr-2" />}
                {(!user.role || user.role === 'customer') && <User size={16} className="mr-2" />}
                {user.role || "customer"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  (user.isActive || user.status === 'active') ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm ${
                  (user.isActive || user.status === 'active') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(user.isActive || user.status === 'active') ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Created At</label>
              <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 
                 user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, setUsers, setShowEditUserModal }) => {
  const [formData, setFormData] = useState({
    username: user.username || user.name || '',
    email: user.email || '',
    role: user.role || 'customer',
    isActive: user.isActive || user.status === 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const accessToken = await getAccessToken(session);
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await flaskApi.put(`/admin/users/${user.id}`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message === "User updated successfully" || response.status === 200) {
        toast.success('User updated successfully!');
        
        // Refresh user list
        const usersRes = await flaskApi.get('/admin/users', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setUsers(usersRes.data);
        closeModal();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (err) => {
    if (err.message.includes("token") || err.response?.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      signOut({ redirect: false });
      router.push('/login');
    } else {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowEditUserModal(false), 300);
  };

  // Check if user is authenticated and has proper session
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/login');
    return null;
  }

    // Only allow admins to edit users
  const isAdmin = session?.user?.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 text-center text-red-400">
          Only admins can edit users.
        </div>
      </div>
    );
  }

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'}
    `}>
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeModal}
      />
      
      <div className={`
        relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Edit className="mr-2" size={24} />
            Edit User
          </h2>
          <button 
            onClick={closeModal}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm animate-shake">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="customer">Customer</option>
                <option value="designer">Designer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="ml-2 text-sm font-medium text-slate-300">
                Active User
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:shadow-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center disabled:opacity-70 transition-all duration-200 hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit size={18} className="mr-2" />
                  Update User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddUserModal = ({ setUsers, setShowAddUserModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Animation on mount/unmount
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const accessToken = await getAccessToken(session);
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

 // Use the correct endpoint for admin user creation
      const response = await flaskApi.post('/admin/create_user', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message === "User created successfully" || response.status === 201) {
        toast.success('User created successfully!');
        
        // Refresh user list
        const usersRes = await flaskApi.get('/admin/users', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setUsers(usersRes.data);
        closeModal();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (err) => {
    if (err.message.includes("token") || err.response?.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      signOut({ redirect: false });
      router.push('/login');
    } else {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create user';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowAddUserModal(false), 300);
  };

  // Check if user is authenticated and has proper session
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/login');
    return null;
  }

    // Only allow admins to add users
  const isAdmin = session?.user?.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 text-center text-red-400">
          Only admins can add users.
        </div>
      </div>
    );
  }

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'}
    `}>
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeModal}
      />
      
      {/* Modal container with animation */}
      <div className={`
        relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <UserPlusIcon className="mr-2" size={24} />
            Create New User
          </h2>
          <button 
            onClick={closeModal}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm animate-shake">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
            
            <div className="animate-fadeIn delay-100">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter password"
                required
              />
            </div>
            
            <div className="animate-fadeIn delay-200">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="customer">Customer</option>
                <option value="designer">Designer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:shadow-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center disabled:opacity-70 transition-all duration-200 hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <UserPlusIcon size={18} className="mr-2" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = ({
  filteredUsers,
  showAddUserModal,
  setShowAddUserModal,
  setUsers,
  confirmDelete
}) => {
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center">
          <Users size={18} className="text-slate-300 mr-2 sm:mr-3" />
          <h3 className="text-base sm:text-lg font-semibold text-white">User Management</h3>
          <span className="ml-2 sm:ml-3 bg-slate-700 text-slate-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
            {filteredUsers.length} users
          </span>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
          >
            <UserPlus size={18} className="mr-2" />
            Add User
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-lg">
        <table className="min-w-full divide-y divide-slate-700/50">
          <thead className="bg-slate-900/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>User</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Mail size={16} />
                  <span>Email</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Shield size={16} />
                  <span>Role</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Activity size={16} />
                  <span>Status</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Created</span>
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/50 divide-y divide-slate-700/30">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr
                  key={user.id || idx}
                  className="hover:bg-slate-700/30 transition-colors duration-150 group"
                >
                  {/* User Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-200">
                          {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                          (user.isActive || user.status === 'active') ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-200">
                          {user.username || user.name || `User ${idx + 1}`}
                        </div>
                        <div className="text-xs text-slate-400">
                          @{user.username?.toLowerCase() || 'user' + (idx + 1)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">
                      {user.email || `user${idx + 1}@example.com`}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </div>
                  </td>

                  {/* Role Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'designer' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                      {user.role === 'designer' && <PenTool size={12} className="mr-1" />}
                      {(!user.role || user.role === 'customer') && <User size={12} className="mr-1" />}
                      {user.role || "customer"}
                    </div>
                  </td>

                  {/* Status Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        (user.isActive || user.status === 'active') ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm ${
                        (user.isActive || user.status === 'active') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(user.isActive || user.status === 'active') ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>

                  {/* Created Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() :
                        user.created_at ? new Date(user.created_at).toLocaleDateString() :
                          new Date().toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                        user.created_at ? new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Actions Cell */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Tooltip content="View User">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-slate-400 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
                        >
                          <Eye size={16} />
                        </button>
                      </Tooltip>

                      {isAdmin && (
                        <>
                          <Tooltip content="Edit User">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-slate-400 hover:text-green-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
                            >
                              <Edit size={16} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Delete User">
                            <button
                              onClick={() => confirmDelete(user)}
                              className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Users size={48} className="text-slate-500" />
                    <div className="text-slate-400 text-lg font-medium">No users found</div>
                    <div className="text-slate-500 text-sm">
                      {filteredUsers.length === 0 ? 'No users match your search criteria' : 'Start by adding your first user'}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-all duration-200 hover:shadow-lg"
                      >
                        <UserPlus size={18} className="mr-2" />
                        Add First User
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          setUsers={setUsers}
          setShowAddUserModal={setShowAddUserModal}
        />
      )}

      {showViewUserModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          setShowViewUserModal={setShowViewUserModal}
        />
      )}

      {showEditUserModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          setUsers={setUsers}
          setShowEditUserModal={setShowEditUserModal}
        />
      )}
    </div>
  );
};

export default UserManagement;