'use client';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import UserProfile from '@/components/profile/UserProfile';
import UserProfileMobile from '@/components/profile/UserProfileMobile';
import AuthAPI from '@/features/auth';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes } from '@/types/profile';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import useSWR from 'swr';

export default function ProfilePage() {
    const params = useSearchParams();
    const { data: profile } = useSWR<MyProfileRes>(PROFILE_KEY);
    const { initializeProfile } = UseProfile();

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await AuthAPI.getUserInfo();
                initializeProfile(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [initializeProfile]);

    if (!profile) return;

    return (
        <div>
            <div className="sm:hidden">
                <Header />
                <UserProfile profile={profile}/>
            </div>

            <div className="sm:block hidden height-screen-vh">
                <Header />
                <UserProfileMobile profile={profile}/>
                <Footer />
            </div>
        </div>
    );
}
