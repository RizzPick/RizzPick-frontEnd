import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('Authorization');
    const status = request.cookies.get('status');

    if (request.nextUrl.pathname.startsWith('/user') || request.nextUrl.pathname.startsWith('/profile')) {
        if (!authToken) {
            return NextResponse.redirect(
                'https://will-you-front-end-fawn.vercel.app/signin?message=login_required'
            );
        } else if (status?.value === 'false' && request.nextUrl.pathname !== '/profile/edit') {
            return NextResponse.redirect(
                'https://will-you-front-end-fawn.vercel.app/profile/edit'
            );
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/user/:path+', '/profile/:path*'],
};
