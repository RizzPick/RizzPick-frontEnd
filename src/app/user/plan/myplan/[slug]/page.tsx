'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { PlanAPI } from '@/features/plan/dating';
import { UserProfile } from '@/types/match/type';
import Image from 'next/image';
import profileImage from '../../../../../../public/images/profiledog1.jpeg';

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
            .get(`https://willyouback.shop/api/dating/${slug}`, {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            })
            .then((response) => {
                const datingData = response.data;
                setDating({
                    datingTitle: datingData.data.datingTitle,
                    datingLocation: datingData.data.datingLocation,
                    datingTheme: datingData.data.datingTheme,
                });
                console.log(datingData.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {});
    if (dating == undefined) {
        return;
    }

    return (
        <div className=" w-4/5 h-[100vh] p-4 mx-auto">
            <div className="flex flex-row">
                <div className="w-1/6">목록 보이기</div>
                <div className="flex flex-col justify-evenly w-full border-l-[1px] border-r-[1px] border-[whitegray]">
                    <div className="flex flex-col items-center p-4 w-full">
                        <div className="flex flex-col p-4">
                            <h1>{dating.datingTitle}</h1>
                            <h2>{dating.datingLocation}</h2>
                            <h3>{dating.datingTheme}</h3>
                        </div>
                    </div>
                    <div className="flex flex-col p-4 w-full">
                        <div className="flex-col items-center p-4 w-full">
                            <h3 className="">데이트 내용</h3>
                            <div className="p-2 my-2  border-[1px] border-[black] rounded-lg">
                                먼저 한강에서 간단하게 푸드트럭에서 뭐 먹을까요?
                            </div>
                            <div className="p-2 my-2 border-[1px] border-[black] rounded-lg">
                                둘이서 자전거 타요!
                            </div>
                            <div className="p-2 my-2 border-[1px] border-[black] rounded-lg">
                                돗자리 깔고 치맥으로 마무리!
                            </div>
                            <div className="p-2 my-2 border-[1px] border-[black] rounded-lg">
                                활동 4
                            </div>
                            <div className="p-2 my-2 border-[1px] border-[black] rounded-lg">
                                활동 5
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/6">
                    <div className="h-screen w-[395px] flex flex-col items-center"></div>
                </div>
            </div>
        </div>
    );
}
