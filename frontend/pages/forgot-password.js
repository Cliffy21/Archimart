import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
      
      setMessage(data.message || 'Password reset instructions have been sent to your email');
      
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md p-8 mx-4 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Reset Password
          </h1>
          <p className="text-gray-300 mt-2">Enter your email to receive reset instructions</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isLoading 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
          
          {error && (
            <div className="py-3 px-4 bg-red-900/40 border border-red-700 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {message && (
            <div className="py-3 px-4 bg-green-900/40 border border-green-700 text-green-200 rounded-md text-sm">
              {message}
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium inline-flex items-center"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}