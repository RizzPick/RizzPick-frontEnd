'use client';
import { useState, useEffect, useCallback } from 'react';
import { MatchAPI } from '../../features/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';
import { AiOutlineInfoCircle } from "react-icons/ai"
import toast from 'react-hot-toast';
import { calculateAge } from '@/utils/dateUtils';
import Loader from '../common/Loader';
import NoUserAlert from './NoUserAlert';
import MatchControls from './MatchControls';

import HomeIcon from "../../../public/profileIcon/Home.svg";
import ReportIcon from "../../../public/profileIcon/Report.svg";
import LeftBtnIcon from "../../../public/matchIcon/left.svg";
import RightBtnIcon from "../../../public/matchIcon/right.svg";
import ReportModal from '../common/ReportModal';


function Match() {
    
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [userIndex, setUserIndex] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [isReportModalVisible, setReportModalVisible] = useState(false);

    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await MatchAPI.fetchRandomUser();
            setUsers(response.data.data);
            setUserIndex(0);
            setSlideIndex(0);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const currentUser = users[userIndex] || {};
    

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
        const imageCount = currentUser.profileImages.length;
        if (imageCount < 3) {
            return slideIndex;
        }
        // 기존 로직
        return (slideIndex - 1 + imageCount) % imageCount;
    };

    const getNextImageIndex = () => {
        const imageCount = currentUser.profileImages.length;
        if (imageCount < 3) {
            return (slideIndex + 1) % imageCount;
        }
        return (slideIndex + 1) % imageCount;
    };

    const handleUserChange = (increment:any) => {
        if (increment && userIndex >= users.length - 1) {
            toast('현재 등록되어 있는 유저추천이 끝났습니다, 다음에 다시 또 이용해주세요', { icon: '🥹' });
            setUsers([]);
        } else {
            setUserIndex(i => i + (increment ? 1 : -1));
            setSlideIndex(0);
        }
    };

    const handleUserReaction = async (reaction: 'like' | 'nope') => {
        try {
            const userId = currentUser.userId;
            const response = await (reaction === 'like' ? MatchAPI.sendLike(userId) : MatchAPI.sendNope(userId));

            if (response.status === 200) {
                toast(response.data.message, { icon: reaction === 'like' ? '❤️' : '👎', });
                handleUserChange(true);
            }
        } catch (error) {
            console.error(reaction === 'like' ? '좋아요 보내기 오류:' : '싫어요 보내기 오류:', error);
        }
    };

    if (isLoading) return <Loader />;
    if (users.length === 0) return <NoUserAlert />;

    return (
        <div className="relative flex bg-matchpage-gradient h-[calc(100vh-78px)]">
            <ReportModal
                    isOpen={isReportModalVisible}
                    onClose={() => setReportModalVisible(false)}
                    userId={users[userIndex]?.userId}
                />
            <div className="flex items-start p-10 mx-auto">
                <div>
                    <div className="relative h-[70vh] w-full">
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 m-2 hidden sm:block"
                        >
                            <LeftBtnIcon />
                        </button>

                        <div className="flex">
                            {!isDetailsVisible &&
                                currentUser &&
                                currentUser.profileImages.length >= 3 && (
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
                                                <div className='flex items-center gap-2'>
                                                    <div className='font-bold text-3xl'>{users[userIndex]?.nickname ??
                                                        'Unknown'}</div>
                                                    <div className='text-xl'>{calculateAge(users[userIndex]?.birthday) ?? 'Unknown'}</div>
                                                </div>
                                                <div>
                                                    <button onClick={toggleDetailsVisibility} className='animate-bounce z-30 text-3xl transition-all hover:scale-110 ease-in-out '>
                                                        <AiOutlineInfoCircle />
                                                    </button>   
                                                </div>
                                        </div>
                                        <div className="mt-2">{users[userIndex]?.intro}</div>
                                    </div>
                                    <MatchControls onReaction={handleUserReaction} />
                                </div>
                            )}

                            {!isDetailsVisible &&
                                currentUser &&
                                currentUser.profileImages.length >= 2 && (
                                    <div
                                        className={`relative w-[30vw] h-[70vh] ${currentUser.profileImages.length === 2 ? (''):('-left-[20%]') }  cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out`}
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
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 m-2 hidden sm:block"
                        >
                            <RightBtnIcon />
                        </button>
                    </div>
                </div>
                <div
                    className="flex-1 w-[20vw] h-[60vh] relative ml-12"
                    style={{ display: isDetailsVisible ? 'block' : 'none' }}
                >
                    <div className="border p-4 bg-matchpage-date-gradient rounded-3xl border-neutral-800">
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            나랑 이런 데이트 어때요?
                        </h2>
                        <div className="h-[20vh] border bg-white mx-auto rounded-3xl p-4 flex items-center justify-center border-neutral-800">
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

                    <div
                        className={`p-[18px] bg-profile-edit-gradient border border-neutral-800 max-w-md relative rounded-3xl mx-auto h-[30vh] mt-3 ${
                            isDetailsVisible ? '' : 'hidden'
                        }`}
                    >
                        <div className="p-4 bg-white rounded-3xl h-[25vh] w-full flex flex-col justify-center relative border border-neutral-800">
                            {!users[userIndex].location &&
                            !users[userIndex].mbti &&
                            !users[userIndex].religion ? (
                                <p className="text-center">
                                    작성된 내용이 없습니다.
                                </p>
                            ) : (
                                <>
                                    {users[userIndex].location ? (
                                        <div className="flex items-center gap-4 border-b py-2">
                                            <HomeIcon />
                                            {users[userIndex].location}
                                        </div>
                                    ) : null}
                                    <div className="flex gap-4 flex-col">
                                    {users[userIndex].mbti || users[userIndex].religion ? (
                                        <div className='flex gap-4 border-b py-2'>
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
                                    ): null }
                                        
                                        <div className='flex gap-4'>
                                        {users[userIndex].hobby ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{users[userIndex].hobby}
                                            </div>
                                        ) : null}
                                        {users[userIndex].interest ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{users[userIndex].interest}
                                            </div>
                                        ) : null}
                                        </div>
                                        <div className='cursor-pointer absolute bottom-4 right-4' onClick={() => setReportModalVisible(true)}>
                                            <ReportIcon />
                                        </div>
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
