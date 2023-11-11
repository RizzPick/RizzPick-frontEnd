'use client'
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import UserProfile from '@/components/profile/UserProfile';
import UserProfileMobile from '@/components/profile/UserProfileMobile';
import React from 'react';

export default function ProfilePage() {
    const showHeader = true;
    return (
        <div>
            <div className="sm:hidden">
                <UserProfile />
            </div>

            <div className="sm:block hidden height-screen-vh">
                {showHeader && <Header />}
                <UserProfileMobile />
                <Footer />
            </div>
        </div>
    );
}
