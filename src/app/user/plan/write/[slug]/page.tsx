'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Write from '@/components/plan/Write';
import { Activity } from '@/types/plan/activity/type';
import Header from '@/components/common/Header';
type Props = {
    params: {
        slug: string;
    };
};

interface DatingInfo {
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    activities: Activity[]; // activities 배열을 추가합니다.
}

export default function WritePage({ params: { slug } }: Props) {
    const [dating, setDating] = useState<DatingInfo | null>(null); // datingInfo를 dating으로 변경하고 타입을 추가합니다.

    // 데이터를 불러오는 함수
    const fetchData = async () => {
        try {
            const datingResponse = await axios.get(
                `https://willyouback.shop/api/dating/${slug}`
            );

            // 데이터 구조가 기대한대로라고 가정하고, 데이터를 dating 상태에 저장합니다.
            setDating({
                datingTitle: datingResponse.data.datingTitle,
                datingLocation: datingResponse.data.datingLocation,
                datingTheme: datingResponse.data.datingTheme,
                activities: datingResponse.data.activityResponseDtoList, // activities 데이터를 추가합니다.
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditComplete = () => {
        console.log('Edit Complete');
    };

    if (!dating) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Write
                initialData={dating}
                initialActivities={dating ? dating.activities : []}
                onEditComplete={handleEditComplete}
            />
        </>
    );
}
