'use client';

import { useState, useEffect } from 'react';
import { MatchAPI } from '../../features/match/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';
import { GoDotFill } from "react-icons/go"
import { MdKeyboardDoubleArrowDown } from "react-icons/md"

// ICON
import WhiteHeartIcon from '../../../public/matchIcon/Like.png';
import BadIcon from '../../../public/matchIcon/Nope.png';
import ReadMore from '../../../public/matchIcon/Intro.png';
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.small.svg"
import Home from "../../../public/profileIcon/house.fill.small.svg"
import { getCookie } from '@/utils/cookie';
import toast from 'react-hot-toast';


function MatchMobile() {
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const router = useRouter();

    //! 상세 정보 보이기/숨기기 토글 함수
    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    const detailsStyle = isDetailsVisible ? 'translate-y-0' : 'translate-y-full';


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
        fetchData();
    }, []);

    const handleButtonClick = () => {
        if (userIndex === users.length - 1) {
            toast('현재 등록되어 있는 유저추천이 끝났습니다, 다음에 다시 또 이용해주세요', {icon : '🥹'})
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

    if (!users) return;
    if(!users[userIndex]) return;

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
            toast(response.data.message, {icon: '❤️',});
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
    return (
        <div className="flex height-screen-vh">
            <div className="flex-1 flex justify-evenly items-start p-10 sm:p-2">
                {/*! 유저 정보 */}
                <div className="flex-1 max-w-md rounded-full">
                    {/* 유저 이미지 */}
                    <div className="relative h-[75vh] w-full rounded-2xl overflow-hidden mt-4">
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
                        <div className="absolute w-full bottom-28 text-white flex flex-col p-6 z-30">
                                <div className="text-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4 ">
                                        <p className='font-bold text-3xl'>{users[userIndex]?.nickname ??
                                            'Unknown'}</p>
                                        <p className='text-white text-xl'>{users[userIndex]?.age ?? 'Unknown'}</p>
                                    </div>
                                    <button onClick={toggleDetailsVisibility} className={`${isDetailsVisible ? ("hidden") : ("animate-bounce")} z-30 transition-all hover:scale-110 ease-in-out`}>
                                        <Image src={ReadMore} width={32} height={32} alt='ReadMore'/>
                                    </button>
                                </div>
                                <div className="text-white mt-2">{users[userIndex]?.intro}</div>
                        </div>

                        {/* 좋아요, 싫어요 버튼 */}
                        <div className="absolute text-white w-full flex justify-between p-4 bottom-0">
                            <button
                                className="transform transition-transform duration-500 hover:rotate-90 z-20"
                                onClick={handleNope}
                            >
                                <Image src={BadIcon} width={66} height={66} alt='싫어요' />
                            </button>
                            <button
                                className="animate-pulse animate-twice animate-ease-in-out z-20"
                                onClick={handleLike}
                            >
                                <Image src={WhiteHeartIcon} width={66} height={66} alt='좋아요' />
                            </button>
                        </div>
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
            </div>
        </div>
    );
}

export default MatchMobile;
