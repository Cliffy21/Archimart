import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, LogOut } from 'lucide-react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jwtLoggedIn, setJwtLoggedIn] = useState(false);
  const router = useRouter();
  const { data: _session, status } = useSession();

  // Check JWT login status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      setJwtLoggedIn(!!token);
    }
  }, []);

  // If logged in via NextAuth or JWT, show logout option
  const isLoggedIn = status === 'authenticated' || jwtLoggedIn;

  // Credentials login via Flask backend
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const baseURL = process.env.DATABASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem('token', data.access_token);

      // Optionally, save user info if returned
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setJwtLoggedIn(true);

      // Redirect to dashboard or home
      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Social login via NextAuth
  const handleSocialSignIn = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  // Logout logic for both JWT and NextAuth
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setJwtLoggedIn(false);
    }
    if (status === 'authenticated') {
      await signOut({ callbackUrl: '/login' });
    } else {
      router.replace('/login');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-8 mx-4 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Sign In</h1>
          <p className="text-blue-100 mt-2">Access your account</p>
        </div>

        {isLoggedIn ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-white text-lg font-semibold mb-2">
              You are already logged in.
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
            <div className="mt-4 text-blue-100">
              Want to create a new account?{' '}
              <Link href="/signup" className="text-blue-300 hover:text-white font-medium">
                Sign up
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 py-3 px-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-md text-sm flex items-start backdrop-blur-sm">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Credentials Login Form */}
            <form onSubmit={handleCredentialsLogin} className="space-y-6">
<div className="relative">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-300">
    <Mail size={18} />
  </div>
  <input
    type="text"
    placeholder="Username"
    value={username}
    required
    onChange={e => setUsername(e.target.value)}
    className="w-full pl-10 pr-12 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-blue-200/70 backdrop-blur-sm"
  />
</div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-300">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-blue-200/70 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded border-blue-300 bg-white/10 focus:ring-blue-400 text-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-blue-100">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-blue-300 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLoading 
                    ? 'bg-blue-600/50 text-white/70 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Sign In</span>
                    <LogIn size={18} className="ml-2" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-blue-100 text-sm mb-4 text-center">Or continue with</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => handleSocialSignIn('google')}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.785-1.667-4.166-2.716-6.735-2.716-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleSocialSignIn('github')}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-blue-100">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-300 hover:text-white transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}