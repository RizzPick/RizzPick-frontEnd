'use client';
import Footer from '@/components/common/Footer';
import UserProfile from '@/components/profile/UserProfile';
import UserProfileMobile from '@/components/profile/UserProfileMobile';
import React from 'react';

export default function ProfilePage() {
    return (
        <div>
            <div className="sm:hidden">
                <UserProfile />
            </div>

            <div className="sm:block hidden height-screen-vh">
                <UserProfileMobile />
                <Footer />
            </div>
        </div>
    );
}
