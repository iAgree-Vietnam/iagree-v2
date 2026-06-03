import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only run on login page
  if (request.nextUrl.pathname === '/login') {
    const sessionCookie = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token';
    
    const cookieValue = request.cookies.get(sessionCookie)?.value;
    
    if (cookieValue) {
      try {
        // Validate session with server
        const sessionResponse = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
          headers: {
            'content-type': 'application/json',
            cookie: request.cookies.toString(),
          },
        });
        
        const sessionData = await sessionResponse.json();
        
        // If session is invalid, clear all next-auth cookies
        if (!sessionResponse.ok || !sessionData?.user) {
          const response = NextResponse.next();
          
          // Clear all next-auth related cookies
          request.cookies.getAll().forEach((cookie) => {
            if (cookie.name.includes('next-auth')) {
              response.cookies.set(cookie.name, '', {
                expires: new Date(0),
                path: '/',
                domain: cookie.name.startsWith('__Secure-') ? undefined : 'localhost',
              });
            }
          });
          
          // Add query parameter to show message
          const url = request.nextUrl.clone();
          url.searchParams.set('message', 'please_login_again');
          return NextResponse.redirect(url);
        }
      } catch (error) {
        
        // Clear cookies on validation failure
        const response = NextResponse.next();
        request.cookies.getAll().forEach((cookie) => {
          if (cookie.name.includes('next-auth')) {
            response.cookies.set(cookie.name, '', {
              expires: new Date(0),
              path: '/',
            });
          }
        });
        
        const url = request.nextUrl.clone();
        url.searchParams.set('message', 'please_login_again');
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
};
