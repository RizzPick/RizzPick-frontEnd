import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('Authorization');
    const status = request.cookies.get('status');

    console.log(status);
    if(request.nextUrl.pathname.startsWith('/user/profile')) {
        if (authToken) {
            // 토큰이 있다면, 그대로 요청을 진행
            return NextResponse.next();
        } else {
            // 토큰이 없다면, 로그인 페이지로 리다이렉트
            return NextResponse.redirect('http://localhost:3000/user/login?message=login_required');
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/user/profile/:path+']
}
