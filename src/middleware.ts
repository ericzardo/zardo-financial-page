import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Cache headers para assets estáticos
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|gif|png|svg|ico|webp|css|js)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Cache headers para páginas
  if (request.nextUrl.pathname === '/') {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=60')
  }

  const publicRoutes = ['/api/auth/login', '/api/users', '/']
  
  const isPublic = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (!isPublic && request.nextUrl.pathname.startsWith('/api')) {
    
    // Extract Header Authorization: Bearer <token>
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub as string);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 