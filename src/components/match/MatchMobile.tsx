'use client';

import { useState, useEffect, useCallback } from 'react';
import { MatchAPI } from '../../features/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';
import { GoAlert, GoDotFill } from "react-icons/go"
import { MdKeyboardDoubleArrowDown } from "react-icons/md"

// ICON
import WhiteHeartIcon from '../../../public/matchIcon/Like.png';
import BadIcon from '../../../public/matchIcon/Nope.png';
import ReadMore from '../../../public/matchIcon/Intro.png';
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import axios from 'axios';
import apologize from "../../../public/images/apologize.gif"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.small.svg"
import Home from "../../../public/profileIcon/house.fill.small.svg"
import { getCookie } from '@/utils/cookie';
import toast from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import { calculateAge } from '@/utils/dateUtils';
import Loader from '../common/Loader';
import NoUserAlert from './NoUserAlert';
import ReportModal from '../common/ReportModal';
import MatchControls from './MatchControls';


function MatchMobile() {
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [userIndex, setUserIndex] = useState(0);
    const [isReportModalVisible, setReportModalVisible] = useState(false);

    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    const detailsStyle = isDetailsVisible ? 'translate-y-0' : 'translate-y-full';
    

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

    const handleButtonClick = () => {
        if (userIndex >= users.length - 1) {
            toast('현재 등록되어 있는 유저추천이 끝났습니다, 다음에 다시 또 이용해주세요', {icon : '🥹'})
            setUsers([]);
            setUserIndex(0);
        } else {
            setUserIndex((prevIndex) => prevIndex + 1); // 다음 사용자의 인덱스로 업데이트합니다.
            setSlideIndex(0);
        }
    };

    //! 사진 슬라이드
    const currentUser = users[userIndex];
    const [slideIndex, setSlideIndex] = useState(0);

    const nextSlide = () => {
        if (!currentUser) return; // currentUser가 undefined인 경우 early return
        setSlideIndex(
            (prevIndex) => (prevIndex + 1) % currentUser.profileImages.length
        );
    };

    const prevSlide = () => {
        if (!currentUser) return; // currentUser가 undefined인 경우 early return
        setSlideIndex(
            (prevIndex) =>
                (prevIndex - 1 + currentUser.profileImages.length) %
                currentUser.profileImages.length
        );
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
    

    return (
        <div className="flex h-[100%-70px] flex-grow">
            <div className="flex-1 flex justify-evenly items-start px-2">
            <ReportModal
                    isOpen={isReportModalVisible}
                    onClose={() => setReportModalVisible(false)}
                    userId={users[userIndex]?.userId}
                />
            {users.length === 0 && 
                <div className='flex items-center flex-col justify-center h-[60vh] w-full bg-matchpage-gradient rounded-3xl shadow'>
                    <div className='flex items-center flex-col'>
                        <div className='font-bold text-[39px]'><GoAlert color="#cb17f9"/></div>
                        <h1 className='text-3xl font-black mb-[48px]'>sorry</h1>
                        <h1 className='text-base'>앗! 추천할 유저가 없네요.</h1>
                        <h1 className='text-xs'>다른 유저가 나타날 때까지 조금만 기다려 주세요.</h1>
                    </div>
                </div>
            }
                {users.length > 0 && (
                    <div className="flex-1 max-w-md rounded-full">
                    {/* 유저 이미지 */}
                    <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden mt-4">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-300 via-neutral-400 to-black rounded-[20px] z-10 opacity-20"/>
                        {/* 이미지 개수, 현재 페이지 보여주기 */}
                        <div className="flex justify-center mt-4">
                            {currentUser // currentUser가 정의된 경우에만 map 함수를 호출
                                ? currentUser.profileImages.map((_, index) => (
                                    <div key={index} className={`mx-1 z-10 text-2xl ${index === slideIndex ? ('text-white'):('text-gray-500')}`}>
                                        <GoDotFill />
                                    </div>
                                ))
                                : null}
                        </div>
                        {/* 페이지 이동 버튼 */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 m-2 hover:scale-125 transition-all duration-200 ease-in-out"
                        >
                            <LeftButton />
                        </button>

                        {/* 이미지 가져오기 */}
                        {currentUser
                            ? currentUser.profileImages.map(
                                (imageObj, index) => (
                                    <div
                                        className={
                                            index === slideIndex
                                                ? 'slide active'
                                                : 'slide'
                                        }
                                        key={index}
                                    >
                                        {index === slideIndex && (
                                            <Image
                                                src={imageObj.image}
                                                alt="User"
                                                layout="fill"
                                                objectFit="cover"
                                                className="absolute"
                                                priority
                                            />
                                        )}
                                    </div>
                                )
                            )
                            : null}

                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 m-2 hover:scale-125 transition-all duration-200 ease-in-out"
                        >
                            <RightButton />
                        </button>

                        {/* 간단한 정보, 설명란 */}
                        <div className="absolute w-full bottom-16 text-white flex flex-col p-6 z-30">
                                <div className="text-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4 ">
                                        <p className='font-bold text-3xl'>{users[userIndex]?.nickname ??
                                            'Unknown'}</p>
                                        <p className='text-white text-xl'>{calculateAge(users[userIndex]?.birthday) ?? 'Unknown'}</p>
                                    </div>
                                    <button onClick={toggleDetailsVisibility} className={`${isDetailsVisible ? ("hidden") : ("animate-bounce")} z-30 transition-all hover:scale-110 ease-in-out`}>
                                        <Image src={ReadMore} width={32} height={32} alt='ReadMore'/>
                                    </button>
                                </div>
                                <div className="text-white mt-2">{users[userIndex]?.intro}</div>
                        </div>

                        <MatchControls onReaction={handleUserReaction} />
                        <div className={`absolute -bottom-1 w-full transform ${detailsStyle} transition-transform duration-300 ease-in-out p-6 bg-white z-40 rounded-t-3xl h-[170px]`}>
                        <div className={`group ${!isDetailsVisible && "hidden"}`}>
                                <div 
                                    onClick={toggleDetailsVisibility} 
                                    className="absolute -top-1 left-[50%] text-white animate-bounce px-2 py-2 bg-fuchsia-400 rounded-full cursor-pointer"
                                >
                                    <MdKeyboardDoubleArrowDown />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                            <div className='bg-white rounded-2xl flex flex-col gap-3 justify-center text-xs w-full'>
                                {!users[userIndex].location && !users[userIndex].education && !users[userIndex].mbti && !users[userIndex].religion ? 
                                        <p className="text-center">작성된 내용이 없습니다.</p> 
                                        : 
                                        <>
                                            { users[userIndex].education ? <><div className='flex items-center gap-4'><EducationIcon/>{users[userIndex].education}</div><hr/></> : null }
                                            { users[userIndex].location ? <><div className='flex items-center gap-4'><Home/>{users[userIndex].location}</div><hr/></> : null }
                                            <div className='flex items-center gap-4'>
                                            { users[userIndex].mbti ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{users[userIndex].mbti}</div> : null }
                                            { users[userIndex].religion ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{users[userIndex].religion}</div> : null }
                                            </div>
                                        </>
                                }
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default MatchMobile;
