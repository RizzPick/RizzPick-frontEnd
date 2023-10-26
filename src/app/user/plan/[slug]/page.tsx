'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { PlanAPI } from '@/features/plan/dating';
import { UserProfile } from '@/types/match/type';
import Image from 'next/image';
import profiledog from '../../../../../public/images/profiledog.jpeg';
import { getUserProfileData } from '@/features/plan/dating';

type Props = {
    params: {
        slug: string;
    };
};

interface DatingInfo {
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    activities: { activityContent: string }[]; // activities 배열을 추가합니다.
}

export default function PostPage({ params: { slug } }: Props) {
    const [dating, setDating] = useState<DatingInfo>();
    const [userProfile, setUserProfile] = useState<UserProfile>();

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
                    activities: datingData.data.activityResponseDtoList,
                });
                // 데이트를 작성한 사용자의 ID를 가져와서 프로필 정보를 불러옵니다.
                return getUserProfileData(datingData.data.userId);
            })
            .then((userData) => {
                setUserProfile(userData); // 프로필 데이터를 상태에 설정합니다.
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
                <div className="w-1/6"></div>
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
                            {dating &&
                                dating.activities.map(
                                    (
                                        activity,
                                        index // activities 배열을 매핑합니다.
                                    ) => (
                                        <div
                                            key={index}
                                            className="p-2 my-2 border-[1px] border-[black] rounded-lg"
                                        >
                                            {activity.activityContent}
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                </div>
                <div className="w-1/6">
                    <div className="h-screen w-[395px] flex flex-col items-center">
                        <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-5">
                            <Image
                                src={profiledog}
                                alt="Picture of the author"
                                width={231}
                                height={231}
                                priority
                            />
                        </div>
                        <div>
                            {userProfile && (
                                <div>
                                    <h2>{userProfile.nickname}</h2>
                                    <p>나이: {userProfile.age}</p>
                                    <p>성별 : {userProfile.gender}</p>
                                    <p>MBTI : {userProfile.mbti}</p>
                                    <p>학력 : {userProfile.education}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
