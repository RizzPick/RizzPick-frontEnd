'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';

type Props = {
    params: {
        slug: string;
    };
};

interface DatingInfo {
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
}

export default function PostPage({ params: { slug } }: Props) {
    const [dating, setDating] = useState<DatingInfo>();

    useEffect(() => {
        axios
            .get('https://willyouback.shop/api/datings', {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            })
            .then((response) => {
                const datingData = response.data;
                setDating({
                    datingTitle: datingData.datingTitle,
                    datingLocation: datingData.datingLocation,
                    datingTheme: datingData.datingTheme,
                });
                console.log(datingData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    if (dating == undefined) {
        return;
    }

    return (
        <>
            <h1>{dating.datingTitle}</h1>
            <h2>{dating.datingLocation}</h2>
            <h3>{dating.datingTheme}</h3>
        </>
    );
}
