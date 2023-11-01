'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { PlanAPI } from '@/features/plan/dating';
import { UserProfile } from '@/types/match/type';
import Image from 'next/image';
import profiledog from '../../../../../public/images/profiledog.jpeg';
import { getUserProfileData } from '@/features/plan/dating';
import { getDateList } from '@/features/plan/dating';
import Link from 'next/link';
import LocationIcon from '../../../../../public/planIcon/location.svg';
import EducationIcon from '../../../../../public/planIcon/education.svg';
import LiveIcon from '../../../../../public/planIcon/live.svg';
import WhiteHeartIcon from '../../../../../public/matchIcon/Like.png';
import BadIcon from '../../../../../public/matchIcon/Nope.png';
import BackIcon from '../../../../../public/planIcon/back.svg';
import Header from '@/components/common/Header';

type Props = {
    params: {
        slug: string;
    };
};

interface DateItem {
    datingId: number;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
}

interface DatingInfo {
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    activities: { activityContent: string }[]; // activities 배열을 추가합니다.
}

export default function PostPage({ params: { slug } }: Props) {
    const [dating, setDating] = useState<DatingInfo>();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [dateList, setDateList] = useState<DateItem[]>([]);
    const [activePage, setActivePage] = useState(slug);
    const targetUserId = userProfile?.userId as string;
    const userId = getCookie('userId') as string;
    const router = useRouter();

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
                // 여기서 userId를 사용하여 getDateList를 호출합니다.
                return getDateList(userData.userId);
            })
            .then((dateListData) => {
                // dateListData를 사용하여 dateList 상태를 설정합니다.
                setDateList(dateListData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {});
    if (dating == undefined) {
        return;
    }

    const handleImageClick = () => {
        const targetProfileUrl = `/user/profile/${targetUserId}`;
        router.push(targetProfileUrl); // Navigate to the target profile page when the image is clicked
    };

    // 좋아요 보내기 함수
    const sendLike = async (userId: string, targetUserId: string) => {
        try {
            const url = `https://willyouback.shop/api/like/${targetUserId}`;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: getCookie('Authorization'),
                        Authorization_Refresh: getCookie(
                            'Authorization_Refresh'
                        ),
                    },
                }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // 싫어요 보내기 함수
    const sendNope = async (userId: string, targetUserId: string) => {
        try {
            const url = `https://willyouback.shop/api/nope/${targetUserId}`;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: getCookie('Authorization'),
                        Authorization_Refresh: getCookie(
                            'Authorization_Refresh'
                        ),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // 좋아요 버튼 클릭 핸들러
    const handleLike = async () => {
        try {
            const response = await sendLike(userId, targetUserId); // userId와 targetUserId 값을 제공하세요
            alert(response.data.message);
        } catch (error) {
            console.error('좋아요 보내기 오류:', error);
        }
    };

    // 싫어요 버튼 클릭 핸들러
    const handleNope = async () => {
        try {
            const response = await sendNope(userId, targetUserId); // userId와 targetUserId 값을 제공하세요
            console.log(response);
        } catch (error) {
            console.error('싫어요 보내기 오류:', error);
        }
    };

    const handleBackButtonClick = () => {
        history.back();
    };

    return (
        <>
            <Header />
            <div className="hidden sm:block">
                <div
                    className="flex flex-row h-20 mb-4 items-center"
                    onClick={() => console.log('Parent clicked')}
                >
                    <button onClick={handleBackButtonClick} className="p-4">
                        <BackIcon />
                    </button>
                    <p className="text-neutral-700 text-xl font-medium leading-tight tracking-wide mx-auto">
                        데이트 계획
                    </p>
                    <div
                        className="h-[45px] w-[45px] rounded-full overflow-hidden mr-2 z-50 pointer-events-auto"
                        onClick={handleImageClick}
                        onTouchStart={handleImageClick}
                    >
                        {userProfile &&
                        userProfile.profileImages &&
                        userProfile.profileImages.length > 0 ? (
                            <Image
                                src={userProfile.profileImages[0].image || ''}
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
                </div>
            </div>
            <div className="w-full pl-4 mx-auto sm:p-0">
                <div className="flex flex-row">
                    <div className="w-[365px] ml-4 my-auto sm:hidden">
                        <ul>
                            {dateList.map((date, index) => (
                                <li
                                    key={index}
                                    className={`flex flex-col border-2 border-rgba(172, 172, 172, 0.69) w-[332px] h-[74px] px-2 pt-2 ${
                                        activePage === date.datingId.toString()
                                            ? 'bg-[#F9ECFF]'
                                            : ''
                                    }`}
                                    style={{ borderRadius: '4px 0px 0px 4px' }}
                                    onClick={() =>
                                        setActivePage(date.datingId.toString())
                                    }
                                >
                                    <Link href={`${date.datingId}`}>
                                        <div
                                            className={`font-bold-500 text-[24px] ${
                                                activePage ===
                                                date.datingId.toString()
                                                    ? 'text-black'
                                                    : ''
                                            }`}
                                        >
                                            <span>{date.datingTitle}</span>
                                        </div>
                                        <div
                                            className={`text-[#aaa] mt-2 text-xs text-end ${
                                                activePage ===
                                                date.datingId.toString()
                                                    ? 'text-black'
                                                    : ''
                                            }`}
                                        >
                                            <span>
                                                데이트 계획을 생성한 날짜
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col w-full border-l-[2px] border-r-[2px] border-[#C5C5C5] sm:border-none">
                        <div className="flex flex-col mt-28 mx-auto p-4 w-5/6 border-b-2 border-[#C5C5C5] sm:border-dashed sm:border-b-2 sm:border-[#D57DFF] sm:max-w-[350px] sm:mt-0 sm:w-full">
                            <div className="flex flex-col p-4">
                                <p className="text-[25px] text-[#666666] sm:text-base sm:font-medium">
                                    {dating.datingLocation}
                                </p>
                                <p className="text-[36px] mt-1 mb-4 font-semibold sm:text-xl sm:font-medium sm:my-4">
                                    {dating.datingTitle}
                                </p>
                                <p className="text-[25px] sm:text-lg sm:font-medium">
                                    {dating.datingTheme}
                                </p>
                                <p className="text-[#aaa] mt-10 text-xs text-end sm:order-first sm:text-start sm:mb-8 sm:mt-0">
                                    작성시간
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mx-auto p-4 w-5/6 sm:w-full ">
                            <div className="flex-col items-center p-4 w-full">
                                <p className="flex justify-center mb-10 text-[30px]">
                                    데이트 내용 🎈
                                </p>
                                {dating &&
                                    dating.activities.map(
                                        (
                                            activity,
                                            index // activities 배열을 매핑합니다.
                                        ) => (
                                            <div
                                                key={index}
                                                className="p-2 my-2 border-[3px] border-[#D67DFFCC] rounded-lg sm:border-[2px] sm:w-[327px]"
                                            >
                                                {activity.activityContent}
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className={`w-[394px] sm:hidden`}>
                        <div className="h-screen w-[395px] flex flex-col items-center">
                            <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-[136px]">
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
                            <div className="w-full mt-4">
                                {userProfile && (
                                    <div>
                                        {/* 이름, 나이 */}
                                        <div className="flex flex-row w-full h-16 border-b-2 border-[#C5C5C5] items-center justify-center text-[28px]">
                                            <h2>{userProfile.nickname}</h2>
                                            <p>{userProfile.age}</p>
                                        </div>

                                        {/* 지역, 학력 */}
                                        <div className="flex flex-col w-full gap-[20px] p-4 border-dashed border-b-2 border-[#C5C5C5]">
                                            <div className="flex flex-row">
                                                <LocationIcon />
                                                <p className="ml-4">
                                                    {userProfile.location}
                                                </p>
                                            </div>
                                            <div className="flex flex-row">
                                                <EducationIcon />
                                                <p className="ml-4">
                                                    {userProfile.education}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 사는 곳 등등 */}
                                        <div className="flex flex-col w-full gap-[20px] p-4 border-b-2 border-[#C5C5C5]">
                                            <div className="grid grid-cols-4 gap-4">
                                                <p className="flex justify-center items-center border-2 border-border-solid w-[90px] h-[35px] rounded-3xl">
                                                    {userProfile.mbti}
                                                </p>
                                                <p className="flex justify-center items-center border-2 border-border-solid w-[90px] h-[35px] rounded-3xl">
                                                    {userProfile.religion}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative mt-10 text-white w-full flex justify-around p-4">
                                            <button
                                                className="hover:scale-110 transition-all ease-in-out z-20"
                                                onClick={handleNope}
                                            >
                                                <Image
                                                    src={BadIcon}
                                                    width={66}
                                                    height={66}
                                                    alt="싫어요"
                                                />
                                            </button>
                                            <button
                                                className=" hover:scale-110 transition-all ease-in-out z-20"
                                                onClick={handleLike}
                                            >
                                                <Image
                                                    src={WhiteHeartIcon}
                                                    width={66}
                                                    height={66}
                                                    alt="좋아요"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
