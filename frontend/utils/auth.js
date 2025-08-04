import { getSession } from 'next-auth/react';

export const getAccessToken = async () => {
  const session = await getSession();
  return session?.accessToken;
};

export const checkUserRole = async (requiredRole) => {
  const session = await getSession();
  if (!session || session.user.role !== requiredRole) {
    return false;
  }
  return true;
};

export const redirectIfUnauthenticated = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
  return { props: {} };
};