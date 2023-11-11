'use client';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Match from '@/components/match/Match';
import MatchMobile from '@/components/match/MatchMobile';
// import useGeolocation from '@/hooks/useGeolocation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function MatchPage() {
    const [mobile, setMobile] = useState(false);
    // const location = useGeolocation();

    const isMobile = useMediaQuery({
        query: '(max-width:767px)',
    });

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile]);
    const showHeader = true;

    return (
        <div className="bg-white">
            {mobile ? (
                <div className="height-screen-vh">
                    {showHeader && <Header />}
                    <MatchMobile />
                    <Footer />
                </div>
            ) : (
                <div>
                    {showHeader && <Header />}
                    <Match />
                </div>
            )}
        </div>
    );
}
