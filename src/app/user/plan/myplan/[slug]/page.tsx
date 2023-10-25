'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { PlanAPI } from '@/features/plan/dating';
import { UserProfile } from '@/types/match/type';
import Image from 'next/image';
import profiledog from '../../../../../../public/images/profiledog1.jpeg';
import { getUserProfileData } from '@/features/plan/dating';
import Write from '@/components/plan/Write';

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
    const [isEditing, setIsEditing] = useState(false);

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Assume the API endpoint is '/api/activities'
        axios
            .get('https://willyouback.shop/api/activities')
            .then((response) => {
                setActivities(response.data.data); // Adjust this line according to the response structure
            })
            .catch((error) => {
                console.error('Error fetching activities:', error);
            });
    }, []);

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

    const handleEditClick = () => {
        setIsEditing(true); // 수정 버튼을 클릭하면 isEditing 상태를 true로 설정합니다.
    };

    const handleEditComplete = () => {
        // 수정이 완료된 후 데이터를 다시 가져옵니다.
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
                setIsEditing(false); // 그리고 isEditing 상태를 false로 설정합니다.
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const handleDeleteClick = () => {
        axios
            .delete(`https://willyouback.shop/api/dating/${slug}`, {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            })
            .then((response) => {
                if (response.data.status === 'success') {
                    window.location.href = '/user/plan/myplan';
                } else {
                    console.error(
                        'Error deleting dating:',
                        response.data.message
                    );
                }
            })
            .catch((error) => {
                console.error('Error deleting dating:', error);
            });
    };

    return (
        <div className=" w-4/5 h-[100vh] p-4 mx-auto">
            {isEditing ? (
                // isEditing 상태가 true일 때 Write 컴포넌트를 렌더링합니다.
                <Write
                    initialData={dating}
                    initialActivities={activities}
                    onEditComplete={handleEditComplete}
                />
            ) : (
                // isEditing 상태가 false일 때 기존의 렌더링을 수행합니다.
                <>
                    <button onClick={handleEditClick}>수정</button>
                    <button onClick={handleDeleteClick}>삭제</button>
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
                                    {userProfile &&
                                    userProfile.profileImages &&
                                    userProfile.profileImages.length > 0 ? (
                                        <Image
                                            src={
                                                userProfile.profileImages[0]
                                                    .image || ''
                                            }
                                            alt="User profile image"
                                            width={231}
                                            height={231}
                                            priority
                                        />
                                    ) : (
                                        <Image
                                            src={profiledog}
                                            alt="Default profile image"
                                            width={231}
                                            height={231}
                                            priority
                                        />
                                    )}
                                </div>
                                <div>
                                    {userProfile && (
                                        <div>
                                            <h2>{userProfile.nickname}</h2>
                                            <p>나이: {userProfile.age}</p>
                                            <p>성별 : {userProfile.gender}</p>
                                            <p>MBTI : {userProfile.mbti}</p>
                                            <p>
                                                학력 : {userProfile.education}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
