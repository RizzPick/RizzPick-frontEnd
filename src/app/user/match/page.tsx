'use client'
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Match from '@/components/match/Match';
import MatchMobile from '@/components/match/MatchMobile';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function MatchPage() {
    const [mobile, setMobile] = useState(false);

    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    });
    
    useEffect(() => {
        setMobile(isMobile)
    }, [isMobile])

    return (
        <div className="bg-white">
            {mobile ? 
            (<div>
                <Header />
                <MatchMobile />
            </div>):
            (<div>
                <Header />
                <Match />
            </div>)
            }
            
        </div>
    );
}
