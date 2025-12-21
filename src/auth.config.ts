import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login_administracion',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.role) {
        session.user.role = token.role; 
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdministrator = nextUrl.pathname.startsWith('/admin');    
      const isAdministrator = auth?.user?.role == 'admin';

      if (isOnAdministrator) {
        if (isLoggedIn && isAdministrator) return true;
        return false; // Redirect unauthenticated users to login page
      //} else if (isLoggedIn) {
      //  return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
    
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;