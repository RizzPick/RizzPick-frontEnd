'use client';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Match from '@/components/match/Match';
import MatchMobile from '@/components/match/MatchMobile';
import useGeolocation from '@/hooks/useGeolocation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
// import RealTime from '@/components/alarm/RealTime';

export default function MatchPage() {
    const [mobile, setMobile] = useState(false);
    const location = useGeolocation();

    console.log(location);

    const isMobile = useMediaQuery({
        query: '(max-width:767px)',
    });

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile]);

    return (
        <div className="bg-white">
            {mobile ? (
                <div className="height-screen-vh">
                    <Header />
                    {/* <RealTime /> */}
                    <MatchMobile />
                    <Footer />
                </div>
            ) : (
                <div>
                    <Header />
                    <Match />
                </div>
            )}
        </div>
    );
}
