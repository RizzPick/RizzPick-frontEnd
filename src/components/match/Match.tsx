'use client';

import { useState, useEffect } from 'react';
import { MatchAPI } from '../../features/match/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';

// ICON
import WhiteHeartIcon from '../../../public/matchIcon/Like.png';
import BadIcon from '../../../public/matchIcon/Nope.png';
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import axios from 'axios';
import EducationIcon from '../../../public/profileIcon/graduationcap.fill.svg';
import Home from '../../../public/profileIcon/Home.svg';
import { getCookie } from '@/utils/cookie';
import ReadMore from '../../../public/matchIcon/Intro.png';

function Match() {
    const [isDetailsVisible, setDetailsVisible] = useState(false);

    //! 상세 정보 보이기/숨기기 토글 함수
    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    //! 랜덤 매칭
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [userIndex, setUserIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MatchAPI.fetchRandomUser();
                const usersData = response.data.data;

                // users 상태를 usersData로 설정합니다.
                setUsers(usersData);
                console.log('usersData', usersData);
                console.log('responseData', response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // const fetchLikedUsers = async () => {
        //     const response = await axios.get(
        //         'https://willyouback.shop/api/like/status',
        //         {
        //             headers: {
        //                 Authorization: getCookie('Authorization'),
        //                 Authorization_Refresh: getCookie(
        //                     'Authorization_Refresh'
        //                 ),
        //             },
        //         }
        //     );
        //     console.log('like user : ', response.data.data);
        //     return response.data.data; // 좋아요 상태 데이터 반환
        // };

        // const updateUsersArray = async () => {
        //     try {
        //         const likedUsers = await fetchLikedUsers(); // 좋아요 상태 가져오기

        //         // 기존 사용자 배열에서 좋아요를 보낸 사용자 제외
        //         setUsers((prevUsers) =>
        //             prevUsers.filter(
        //                 (user) => !likedUsers.includes(user.userId)
        //             )
        //         );
        //         console.log(users);
        //     } catch (error) {
        //         console.error('Error fetching liked users:', error);
        //         // Optionally, inform the user that an error occurred
        //     }
        // };

        fetchData();
    }, []);

    const handleButtonClick = () => {
        // 처음에 몇명의 유저를 추천받는 지 확인하고, 마지막 유저의 index 가 넘어가게 되면 페이지네이션 로직과 동일하게 유저 추천 배열 늘리기 작업 필요
        if (userIndex === users.length - 1) {
            alert('오늘의 추천이 끝났습니다');
            // setUserIndex(0);
        } else {
            setUserIndex((prevIndex) => prevIndex + 1); // 다음 사용자의 인덱스로 업데이트합니다.
            setSlideIndex(0);
        }
    };

    //! 사진 슬라이드
    const currentUser = users[userIndex];
    const [slideIndex, setSlideIndex] = useState(0);

    const nextSlide = () => {
        if (users[userIndex].profileImages.length === 2) {
            setSlideIndex((prevSlideIndex) => (prevSlideIndex === 1 ? 0 : 1));
        } else {
            setSlideIndex(
                (prevSlideIndex) =>
                    (prevSlideIndex + 1) % users[userIndex].profileImages.length
            );
        }
    };

    const prevSlide = () => {
        if (users[userIndex].profileImages.length === 2) {
            setSlideIndex((prevSlideIndex) => (prevSlideIndex === 0 ? 1 : 0));
        } else {
            setSlideIndex(
                (prevSlideIndex) =>
                    (prevSlideIndex -
                        1 +
                        users[userIndex].profileImages.length) %
                    users[userIndex].profileImages.length
            );
        }
    };

    const getPrevImageIndex = () => {
        if (currentUser.profileImages.length === 1) {
            return 0; // 1장일 경우 현재 인덱스 반환
        }
        if (currentUser.profileImages.length === 2) {
            return slideIndex; // 2장일 경우 현재 인덱스 반환
        }
        return (
            (slideIndex - 1 + currentUser.profileImages.length) %
            currentUser.profileImages.length
        );
    };

    // 다음 이미지 표시 로직
    const getNextImageIndex = () => {
        if (currentUser.profileImages.length === 1) {
            return 0; // 1장일 경우 현재 인덱스 반환
        }
        if (currentUser.profileImages.length === 2) {
            return (slideIndex + 1) % 2; // 2장일 경우 다음 인덱스 반환
        }
        return (slideIndex + 1) % currentUser.profileImages.length;
    };

    if (!users) return;

    const sendLike = async (targetUserId: string) => {
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
            // handleButtonClick();
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // 에러 처리 필요 : 좋아요가 실패해도 handleButtonClick() 함수가 동작할 것으로 보임
    const handleLike = async () => {
        try {
            const response = await sendLike(users[userIndex].userId);
            console.log(response);
            alert(response.data.message);
            handleButtonClick(); // 좋아요를 보낸 후에 다음 사용자의 프로필을 표시합니다.
        } catch (error) {
            console.error('좋아요 보내기 오류:', error);
        }
    };

    const sendNope = async (targetUserId: string) => {
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

    // 에러 처리 필요 : 싫어요가 실패해도 handleButtonClick() 함수가 동작할 것으로 보임
    const handleNope = async () => {
        try {
            const response = await sendNope(users[userIndex].userId);
            console.log(response);
            handleButtonClick(); // 싫어요를 보낸 후에 다음 사용자의 프로필을 표시합니다.
        } catch (error) {
            console.error('싫어요 보내기 오류:', error);
        }
    };

    if (!users[userIndex]) return;

    return (
        <div className="relative flex bg-matchpage-gradient h-[100vh]">
            <div className="flex items-start p-10 mx-auto">
                {/*! 유저 정보 */}
                <div>
                    {/* 유저 이미지 */}
                    <div className="relative h-[70vh] w-full">
                        {/* 페이지 이동 버튼 */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 m-2"
                        >
                            <LeftButton />
                        </button>

                        <div className="flex">
                            {/* 무한 루프의 환상을 위한 이전 이미지 */}
                            {!isDetailsVisible &&
                                currentUser &&
                                currentUser.profileImages.length > 1 && (
                                    <div
                                        className="relative w-[30vw] h-[70vh] -right-[20%] cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
                                        onClick={prevSlide}
                                    >
                                        <Image
                                            src={
                                                currentUser.profileImages[
                                                    getPrevImageIndex()
                                                ].image
                                            }
                                            alt="Previous User"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-2xl scale-90 z-30 shadow-xl opacity-90"
                                            priority
                                        />
                                    </div>
                                )}

                            {/* 현재 이미지 */}
                            {currentUser && (
                                <div>
                                    <div className="relative w-[30vw] h-[70vh]">
                                        <Image
                                            src={
                                                currentUser.profileImages[
                                                    slideIndex
                                                ].image
                                            }
                                            alt="Current User"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-2xl z-40"
                                            priority
                                        />
                                    </div>
                                    <div className="absolute w-[30vw] -bottom-5 flex flex-col z-40 bg-white items-start border rounded-3xl p-4 shadow-md cursor-pointer h-[110px]" onClick={toggleDetailsVisibility}>
                                        <div className="text-2xl flex items-center justify-between w-full">
                                                <div className='font-bold text-3xl'>{users[userIndex]?.nickname ??
                                                    'Unknown'}</div>
                                                <div className='text-xl'>{users[userIndex]?.age ?? 'Unknown'}</div>
                                        </div>
                                        <div className="mt-2">{users[userIndex]?.intro}</div>
                                    </div>
                                    {/* 좋아요, 싫어요 버튼 */}
                                    <div className="absolute text-white w-[30vw] flex justify-center -bottom-28 gap-48">
                                        <button
                                            className="hover:scale-110 transition-all ease-in-out z-20 duration-200"
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
                                            className="hover:scale-110 transition-all ease-in-out z-20 duration-200"
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

                            {/* 다음 이미지 */}
                            {!isDetailsVisible &&
                                currentUser &&
                                currentUser.profileImages.length > 1 && (
                                    <div
                                        className="relative w-[30vw] h-[70vh] -left-[20%] cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
                                        onClick={nextSlide}
                                    >
                                        <Image
                                            src={
                                                currentUser.profileImages[
                                                    getNextImageIndex()
                                                ].image
                                            }
                                            alt="Next User"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-2xl scale-90 z-30 shadow-xl opacity-90"
                                            priority
                                        />
                                    </div>
                                )}
                        </div>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 m-2"
                        >
                            <RightButton />
                        </button>
                    </div>
                </div>

                {/* 데이트 계획 및 상세 정보 */}
                <div
                    className="flex-1 w-[20vw] h-[60vh] relative ml-12"
                    style={{ display: isDetailsVisible ? 'block' : 'none' }}
                >
                    {/* 데이트 계획 */}
                    <div className="border p-4 bg-matchpage-date-gradient rounded-3xl">
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            나랑 이런 데이트 어때요?
                        </h2>
                        <div className="h-[20vh] border bg-white mx-auto rounded-3xl p-4 flex items-center justify-center">
                            {currentUser &&
                            currentUser.dating &&
                            currentUser.dating.length > 1 ? (
                                <ul className="list-disc pl-5 space-y-2">
                                    {users[userIndex].dating?.map((date) => {
                                        return (
                                            <li key={date.datingId}>
                                                {date.datingTitle}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="mx-auto px-4 py-2 mt-4 rounded-3xl font-bold">
                                    작성한 계획이 없습니다
                                </div>
                            )}
                        </div>
                    </div>
                    {/* 상세 정보 */}
                    <div
                        className={`p-[18px] bg-profile-edit-gradient max-w-md relative rounded-3xl mx-auto h-[30vh] mt-3 ${
                            isDetailsVisible ? '' : 'hidden'
                        }`}
                    >
                        <div className="p-4 bg-white rounded-3xl h-[25vh] w-full flex flex-col justify-center gap-3">
                            {!users[userIndex].location &&
                            !users[userIndex].education &&
                            !users[userIndex].mbti &&
                            !users[userIndex].religion ? (
                                <p className="text-center">
                                    작성된 내용이 없습니다.
                                </p>
                            ) : (
                                <>
                                    {users[userIndex].education ? (
                                        <div className="flex items-center gap-4 border-b py-2">
                                            <EducationIcon />
                                            {users[userIndex].education}
                                        </div>
                                    ) : null}
                                    {users[userIndex].location ? (
                                        <div className="flex items-center gap-4 border-b py-2">
                                            <Home />
                                            {users[userIndex].location}
                                        </div>
                                    ) : null}
                                    <div className="flex items-center gap-4">
                                        {users[userIndex].mbti ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{users[userIndex].mbti}
                                            </div>
                                        ) : null}
                                        {users[userIndex].religion ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{users[userIndex].religion}
                                            </div>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Match;
