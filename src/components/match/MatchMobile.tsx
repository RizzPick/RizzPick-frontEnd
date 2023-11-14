'use client';

import { useState } from 'react';
import { MatchAPI } from '../../features/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';
import { GoAlert, GoDotFill } from "react-icons/go"
import { MdKeyboardDoubleArrowDown } from "react-icons/md"

// ICON
import ReadMore from '../../../public/matchIcon/Intro.png';
import ReportIcon from "../../../public/profileIcon/Report.svg";
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import Home from "../../../public/profileIcon/house.fill.small.svg"
import toast from 'react-hot-toast';
import { calculateAge } from '@/utils/dateUtils';
import ReportModal from '../common/ReportModal';
import MatchControls from './MatchControls';

type Props = {
    users : UserProfile[]
    setUsers : any
}

function MatchMobile({users, setUsers} : Props) {
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const [userIndex, setUserIndex] = useState(0);
    const [isReportModalVisible, setReportModalVisible] = useState(false);
    const [detailSlideIndex, setDetailSlideIndex] = useState(0);

    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    const detailsStyle = isDetailsVisible ? 'translate-y-0' : 'translate-y-full';
    const currentUser = users[userIndex];
    const [slideIndex, setSlideIndex] = useState(0);

    const nextSlide = () => {
        if (!currentUser) return;
        setSlideIndex(
            (prevIndex) => (prevIndex + 1) % currentUser.profileImages.length
        );
    };

    const prevSlide = () => {
        if (!currentUser) return;
        setSlideIndex(
            (prevIndex) =>
                (prevIndex - 1 + currentUser.profileImages.length) %
                currentUser.profileImages.length
        );
    };

    const handleUserChange = (increment : boolean) => {
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

    const nextDetailSlide = () => {
        setDetailSlideIndex((prevIndex) => (prevIndex + 1) % 2); // Assuming there are only two slides
      };
      
      const prevDetailSlide = () => {
        setDetailSlideIndex((prevIndex) => (prevIndex - 1 + 2) % 2); // Assuming there are only two slides
      };

    

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
                    <div className="relative h-[calc(70vh-20px)] w-full rounded-2xl overflow-hidden mt-4">
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
                        <div className={`absolute -bottom-1 w-full transform ${detailsStyle} transition-transform duration-300 ease-in-out px-2 py-4 ${detailSlideIndex === 0 ? ("bg-white"):("bg-pink-100")} z-40 rounded-t-3xl h-[170px]`} id="intro">
                        <div className={`group ${!isDetailsVisible && "hidden"}`}>
                        <div className="absolute inset-0 flex items-center justify-between px-2">
                            <button onClick={prevDetailSlide} className="z-50">
                                {"<"}
                            </button>
                            <button onClick={nextDetailSlide} className="z-50">
                                {">"}
                            </button>
                        </div>
                                <div 
                                    onClick={toggleDetailsVisibility} 
                                    className="absolute -top-1 left-[50%] text-white animate-bounce w-4 h-4 bg-fuchsia-400 rounded-full cursor-pointer"
                                >
                                    <MdKeyboardDoubleArrowDown />
                                </div>
                            </div>
                            {detailSlideIndex === 0 && (
                            <div className="flex items-center justify-between h-full">
                                <div className="absolute top-4 right-4 z-50" onClick={() => setReportModalVisible(true)}>
                                    <ReportIcon />
                                </div>
                                <div className='w-full'>
                                    {!users[userIndex].location && !users[userIndex].mbti && !users[userIndex].religion ? 
                                            <div className='bg-white rounded-2xl flex flex-col justify-center text-xs w-full px-4 items-center'>
                                                <p className="text-center">작성된 내용이 없습니다.</p> 
                                            </div>
                                            : 
                                            <div className='bg-white rounded-2xl flex flex-col justify-center text-xs w-full px-4'>
                                                { users[userIndex].location ? <div className='flex items-center gap-4 border-b py-1'><Home/>{users[userIndex].location}</div> : null }
                                                <div className='flex items-center gap-4 border-b py-2'>
                                                { users[userIndex].mbti ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{users[userIndex].mbti}</div> : null }
                                                { users[userIndex].religion ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{users[userIndex].religion}</div> : null }
                                                </div>
                                                <div className='flex items-center gap-4 py-2'>
                                                { users[userIndex].hobby ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{users[userIndex].hobby}</div> : null }
                                                { users[userIndex].interest ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{users[userIndex].interest}</div> : null }
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                            )}

                            {detailSlideIndex === 1 && (
                                <div className="flex items-center justify-between flex-col py-4 bg-white h-full rounded-2xl">
                                    <h1 className='text-2xl'>💜데이트 계획💜</h1>
                                    <div className='flex items-center justify-center h-full'>
                                        {!users[userIndex].dating && <p>작성한 계획이 없습니다.</p>}
                                        {users[userIndex].dating && 
                                            <ul>
                                                <li key={users[userIndex].dating?.datingId}>{users[userIndex].dating?.datingTitle}</li>
                                            </ul>
                                        }
                                        
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                )}
                
            </div>
        </div>
    );
}

export default MatchMobile;
