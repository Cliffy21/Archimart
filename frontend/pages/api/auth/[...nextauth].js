import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60, // 4 hours
    updateAge: 60 * 60 // 1 hour
  },
  providers: [
    CredentialsProvider({
      id: 'flask-credentials',
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.DATABASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          if (!data.access_token) {
            throw new Error('Invalid response from auth server');
          }

          return {
            id: data.id,
            username: credentials.username,
            role: data.role,
            accessToken: data.access_token
          };
        } catch (error) {
          console.error('Credentials auth error:', error);
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        // Custom profile handling to match your user model
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'customer' // Default role for OAuth users
        };
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      async profile(profile) {
        // GitHub profile handling
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'customer'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'customer'; // Fallback role
        
        // For OAuth providers, we need to handle token creation differently
        if (account?.provider !== 'flask-credentials') {
          // Create a session token with your Flask backend for OAuth users
          try {
            const oauthResponse = await fetch(`${process.env.DATABASE_URL}/oauth-login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                provider: account.provider,
                provider_id: user.id,
                email: user.email,
                name: user.name
              })
            });

            const oauthData = await oauthResponse.json();
            
            if (oauthResponse.ok && oauthData.access_token) {
              token.accessToken = oauthData.access_token;
              token.role = oauthData.role || 'customer';
            }
          } catch (error) {
            console.error('OAuth token creation failed:', error);
          }
        } else {
          // For credential login, use the existing token
          token.accessToken = user.accessToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle custom redirects after authentication
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development'
});