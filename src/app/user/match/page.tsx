'use client';
import Footer from '@/components/common/Footer';
import Match from '@/components/match/Match';
import MatchMobile from '@/components/match/MatchMobile';
// import useGeolocation from '@/hooks/useGeolocation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import UserLayout from '../layout';
import { useSearchParams } from 'next/navigation';

export default function MatchPage() {
    const params = useSearchParams();
    const [mobile, setMobile] = useState(false);
    // const location = useGeolocation();

    const isMobile = useMediaQuery({
        query: '(max-width:767px)',
    });

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile]);

    return (
        <div className="bg-white">
            {mobile ? (
                <UserLayout showHeader={true}>
                    <div className="height-screen-vh">
                        <MatchMobile />
                        <Footer />
                    </div>
                </UserLayout>
            ) : (
                <UserLayout showHeader={true}>
                    <div>
                        <Match />
                    </div>
                </UserLayout>
            )}
        </div>
    );
}
