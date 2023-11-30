'use client';
import Footer from '@/components/common/Footer';
import Match from '@/components/match/Match';
import MatchMobile from '@/components/match/MatchMobile';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import UserLayout from '../layout';
import { MatchAPI } from '@/features/match';
import { UserProfile } from '@/types/match/type';
import Loader from '@/components/common/Loader';

export default function MatchPage() {
    const [mobile, setMobile] = useState(false);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await MatchAPI.fetchRandomUser();
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const isMobile = useMediaQuery({
        query: '(max-width:480px)',
    });

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile]);


    if (isLoading) return <Loader />;

    return (
        <div className="bg-white">
            {mobile ? (
                <UserLayout showHeader={true}>
                    <div className="height-screen-vh">
                        <MatchMobile users={users} setUsers={setUsers} />
                        <Footer />
                    </div>
                </UserLayout>
            ) : (
                <UserLayout showHeader={true}>
                    <div>
                        <Match users={users} setUsers={setUsers}/>
                    </div>
                </UserLayout>
            )}
        </div>
    );
}
