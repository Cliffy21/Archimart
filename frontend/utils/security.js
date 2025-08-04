const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Security utilities for password hashing, token management, and other security features
 */

// Password hashing
const passwordUtils = {
  /**
   * Hash a password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  hashPassword: async (password) => {
    const saltRounds = 12; // Higher is more secure but slower
    return await bcrypt.hash(password, saltRounds);
  },

  /**
   * Compare a plain text password with a hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} - True if passwords match
   */
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with isValid and message
   */
  validatePasswordStrength: (password) => {
    if (!password || password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password meets strength requirements' };
  }
};

// JWT token management
const tokenUtils = {
  /**
   * Generate a JWT token for authentication
   * @param {Object} payload - Data to include in the token
   * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d')
   * @returns {string} - JWT token
   */
  generateToken: (payload, expiresIn = '24h') => {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(payload, secret, { expiresIn });
  },

  /**
   * Verify a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} - Decoded token payload or null if invalid
   */
  verifyToken: (token) => {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      return jwt.verify(token, secret);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  },

  /**
   * Generate a refresh token
   * @returns {string} - Refresh token
   */
  generateRefreshToken: () => {
    return crypto.randomBytes(40).toString('hex');
  }
};

// Session management
const sessionUtils = {
  /**
   * Set secure cookie options
   * @param {boolean} isProd - Whether the environment is production
   * @returns {Object} - Cookie options
   */
  getCookieOptions: (isProd = process.env.NODE_ENV === 'production') => {
    return {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: isProd, // Requires HTTPS in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/'
    };
  },

  /**
   * Create a session record
   * @param {Object} db - MongoDB database connection
   * @param {string} userId - User ID
   * @param {string} refreshToken - Refresh token
   * @param {string} userAgent - User agent string
   * @returns {Promise<Object>} - Created session
   */
  createSession: async (db, userId, refreshToken, userAgent) => {
    const sessionsCollection = db.collection('sessions');
    
    const session = {
      userId,
      refreshToken,
      userAgent,
      ip: null, // Set this from the request in your route handler
      isValid: true,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    await sessionsCollection.insertOne(session);
    return session;
  },

  /**
   * Invalidate a session
   * @param {Object} db - MongoDB database connection
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<boolean>} - Whether the session was invalidated
   */
  invalidateSession: async (db, refreshToken) => {
    const sessionsCollection = db.collection('sessions');
    const result = await sessionsCollection.updateOne(
      { refreshToken },
      { $set: { isValid: false } }
    );
    return result.modifiedCount > 0;
  },

  /**
   * Find a valid session by refresh token
   * @param {Object} db - MongoDB database connection
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object|null>} - Session or null if not found
   */
  findSessionByToken: async (db, refreshToken) => {
    const sessionsCollection = db.collection('sessions');
    return await sessionsCollection.findOne({
      refreshToken,
      isValid: true,
      expiresAt: { $gt: new Date() }
    });
  },

  /**
   * Invalidate all sessions for a user
   * @param {Object} db - MongoDB database connection
   * @param {string} userId - User ID
   * @param {string} currentSessionId - Current session ID to exclude (optional)
   * @returns {Promise<number>} - Number of invalidated sessions
   */
  invalidateAllUserSessions: async (db, userId, currentSessionId = null) => {
    const sessionsCollection = db.collection('sessions');
    const query = { userId, isValid: true };
    
    // Exclude current session if provided
    if (currentSessionId) {
      query._id = { $ne: currentSessionId };
    }
    
    const result = await sessionsCollection.updateMany(
      query,
      { $set: { isValid: false } }
    );
    
    return result.modifiedCount;
  }
};

// Security headers and protections
const securityHeaders = {
  /**
   * Get recommended security headers
   * @returns {Object} - Security headers
   */
  getSecurityHeaders: () => {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
  },

  /**
   * Apply security headers to an Express response
   * @param {Object} res - Express response object
   */
  applySecurityHeaders: (res) => {
    const headers = securityHeaders.getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }
};

// Rate limiting helpers
const rateLimiting = {
  /**
   * Simple in-memory rate limiter
   * Note: For production, use a Redis-based solution like 'rate-limit-redis'
   */
  inMemoryStore: new Map(),

  /**
   * Check if a request is rate limited
   * @param {string} key - Rate limit key (e.g., IP address or user ID)
   * @param {number} limit - Maximum number of requests
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} - Whether the request is allowed
   */
  isRateLimited: (key, limit = 100, windowMs = 60 * 1000) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or initialize requests array
    const requests = rateLimiting.inMemoryStore.get(key) || [];
    
    // Filter out requests outside the current window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit is exceeded
    if (recentRequests.length >= limit) {
      return true; // Rate limited
    }
    
    // Add current request timestamp
    recentRequests.push(now);
    rateLimiting.inMemoryStore.set(key, recentRequests);
    
    return false; // Not rate limited
  },

  /**
   * Get remaining requests for a key
   * @param {string} key - Rate limit key
   * @param {number} limit - Maximum number of requests
   * @param {number} windowMs - Time window in milliseconds
   * @returns {number} - Number of remaining requests
   */
  getRemainingRequests: (key, limit = 100, windowMs = 60 * 1000) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const requests = rateLimiting.inMemoryStore.get(key) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, limit - recentRequests.length);
  }
};

// CSRF protection
const csrfProtection = {
  /**
   * Generate a CSRF token
   * @returns {string} - CSRF token
   */
  generateToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

  /**
   * Validate a CSRF token
   * @param {string} token - Token from request
   * @param {string} storedToken - Token from session/cookie
   * @returns {boolean} - Whether the token is valid
   */
  validateToken: (token, storedToken) => {
    if (!token || !storedToken) {
      return false;
    }
    return token === storedToken;
  }
};

// Input sanitization
const sanitization = {
  /**
   * Basic sanitization for user input
   * Note: For more comprehensive sanitization, use a library like DOMPurify
   * @param {string} input - User input
   * @returns {string} - Sanitized input
   */
  sanitizeInput: (input) => {
    if (typeof input !== 'string') {
      return input;
    }
    
    // Replace potentially dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Sanitize an object's string properties
   * @param {Object} obj - Object to sanitize
   * @returns {Object} - Sanitized object
   */
  sanitizeObject: (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitization.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitization.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
};

module.exports = {
  passwordUtils,
  tokenUtils,
  sessionUtils,
  securityHeaders,
  rateLimiting,
  csrfProtection,
  sanitization
};