import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('Authorization');

    if (request.nextUrl.pathname.match(/^\/(user|profile)\b/)) {
        if (!authToken) {
            // 토큰이 없다면, 로그인 페이지로 리다이렉트
            return NextResponse.redirect(
                // 'http://localhost:3000/signin?message=login_required'
                'https://will-you-front-end-fawn.vercel.app/signin?message=login_required'
            );
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/user/:path+', '/profile/:path*'],
};
