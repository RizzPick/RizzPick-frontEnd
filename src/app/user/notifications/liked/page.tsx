import LikeList from '@/components/notifications/LikeList';
import { LikeData } from '@/types/like';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react';
import UserLayout from '../../layout';

async function Likedpage() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('Authorization');
    const token = accessToken?.value;

    if (!token) return;
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/likedby/status`,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    const liked: LikeData[] = response.data.data;

    return (
        <>
            <div className='block sm:hidden'>
                <UserLayout showHeader={true}>
                    <LikeList liked={liked} />
                </UserLayout>
            </div>
            <div className='hidden sm:block'>
                <LikeList liked={liked} />
            </div>
        </>
    );
}

export default Likedpage;
