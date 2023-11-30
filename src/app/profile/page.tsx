'use client';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Loader from '@/components/common/Loader';
import UserProfile from '@/components/profile/UserProfile';
import UserProfileMobile from '@/components/profile/UserProfileMobile';
import AuthAPI from '@/features/auth';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes } from '@/types/profile';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import useSWR from 'swr';

export default function ProfilePage() {
    const { data: profile } = useSWR<MyProfileRes>(PROFILE_KEY);
    const [isLoading, setIsLoading] = useState(true);
    const { initializeProfile } = UseProfile();
    const [mobile, setMobile] = useState(false);
    const isMobile = useMediaQuery({
        query: '(max-width:480px)',
    });

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile]);


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await AuthAPI.getUserInfo();
                initializeProfile(response.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [initializeProfile]);

    if (!profile) return;
    if (isLoading) return <Loader />;

    return (
        <div>
            {!mobile &&
                <div>
                <Header />
                <UserProfile profile={profile}/>
                </div>
            }
            {mobile &&
                <div className="height-screen-vh">
                    <Header />
                    <UserProfileMobile profile={profile}/>
                    <Footer />
                </div>
            }
        </div>
    );
}
