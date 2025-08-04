// lib/errorHandler.js
export const AuthError = {
  InvalidCredentials: 'Invalid email or password',
  AccountExists: 'Account already exists',
  SocialAuthError: 'Social authentication failed',
  Default: 'An unexpected error occurred'
};

export function handleAuthError(error) {
  console.error('Authentication Error:', error);
  
  if (error instanceof Error) {
    switch(error.message) {
      case 'CredentialsSignin': return AuthError.InvalidCredentials;
      case 'AccountExists': return AuthError.AccountExists;
      default: return error.message || AuthError.Default;
    }
  }
  return AuthError.Default;
}