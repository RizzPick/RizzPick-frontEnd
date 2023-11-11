import SignupComponent from '@/components/user/SignupForm';
import React from 'react';

export default function SignupPage() {
    return (
        <>
            <div className="bg-signuppage-gradient sm:height-screen-vh h-full">
                <div className="flex items-center justify-center text-5xl text-white py-[40px] sm:hidden">
                    환영합니다
                </div>
                <SignupComponent />
            </div>
        </>
    );
}
