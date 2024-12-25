import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
    // Middleware code
    const access_token = request.cookies.get("access_token");

    const url = request.nextUrl.pathname;
    if (!access_token && !url.startsWith('/login')) {
        // return NextResponse.redirect('/login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if(access_token && url.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", '/login/:path*'], // Match all paths
  };
  