'use client';

import { useState, useEffect } from 'react';
import { MatchAPI } from '../../features/match/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';
import {GoDotFill } from "react-icons/go"

// ICON
import WhiteHeartIcon from '../../../public/matchIcon/Like.png';
import BadIcon from '../../../public/matchIcon/Nope.png';
import ReadMore from '../../../public/matchIcon/Intro.png';
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import { useRouter } from 'next/navigation';

function Match({ userId }: { userId: string }) {
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const router = useRouter();

    //! 상세 정보 보이기/숨기기 토글 함수
    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    //! 랜덤 매칭
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [userIndex, setUserIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await MatchAPI.fetchRandomUser();
            const usersData = response.data.data;

            const randomIndex = Math.floor(Math.random() * users.length);
            const randomUser = users[randomIndex];
            console.log('users', users);
            console.log('response', response);
            console.log('randomUser', randomUser);
            setUsers(usersData);
        };
        fetchData();
        console.log(users);
    }, []);

    const handleButtonClick = () => {
        if (userIndex === users.length - 1) {
            setUserIndex(0);
        } else {
            setUserIndex((prevIndex) => prevIndex + 1); // 다음 사용자의 인덱스로 업데이트합니다.
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

    return (
        <div className="flex h-[calc(100vh - 100px)]">
            <div className="flex-1 flex justify-evenly items-start p-10 sm:p-2">
                {/*! 유저 정보 */}
                <div className="flex-1 max-w-md rounded-full h-[calc(100vh - 100px)]">
                    {/* 유저 이미지 */}
                    <div className="relative sm:h-[590px] h-[695px] w-[463px] sm:w-full rounded-3xl overflow-hidden sm:mt-14">
                    <div className="absolute top-0 left-0 w-full h-full z-20 bg-gradient-to-b from-white via-[#9f9f9f] to-black opacity-10"></div>
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
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-50 m-2"
                        >
                            <LeftButton />
                        </button>

                        {/* 이미지 가져오기 */}
                        {currentUser // currentUser가 정의된 경우에만 map 함수를 호출
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
                                              />
                                          )}
                                      </div>
                                  )
                              )
                            : null}

                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-50 m-2"
                        >
                            <RightButton />
                        </button>

                        {/* 간단한 정보, 설명란 */}
                        <div className="absolute w-full bottom-28 text-white flex flex-col p-6">
                                <div className="text-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4 ">
                                        <p className='font-bold text-3xl'>{users[userIndex]?.nickname ??
                                            'Unknown'}</p>
                                        <p className='text-gray-400 text-xl'>{users[userIndex]?.age ?? 'Unknown'}</p>
                                    </div>
                                    <button onClick={toggleDetailsVisibility} className='z-10 transition-all hover:scale-110 ease-in-out'>
                                        <Image src={ReadMore} width={32} height={32} alt='ReadMore' />
                                    </button>
                                </div>
                                <div className="text-white mt-2">{users[userIndex]?.intro}</div>
                        </div>

                        {/* 좋아요, 싫어요 버튼 */}
                        <div className="absolute bottom-2 text-white w-full flex justify-between p-4">
                            <button
                                className="hover:scale-110 transition-all ease-in-out"
                                onClick={handleButtonClick}
                            >
                                <Image src={BadIcon} width={66} height={66} alt='싫어요' />
                            </button>
                            <button
                                className="hover:scale-110 transition-all ease-in-out"
                                onClick={handleButtonClick}
                            >
                                <Image src={WhiteHeartIcon} width={66} height={66} alt='좋아요' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 데이트 계획 및 상세 정보 */}
                <div
                    className="flex-1 max-w-md p-6 bg-[#CACFFF] rounded-3xl shadow-lg h-[45vh] relative mr-[60px]"
                    style={{ display: isDetailsVisible ? 'block' : 'none' }}
                >
                    {/* 데이트 계획 */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            나랑 이런 데이트 어때요?
                        </h2>
                        <div className="h-[312px] border bg-white mx-auto rounded-3xl p-4 flex items-center justify-center">
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
                                <button
                                    onClick={() =>
                                        router.push('/user/plan/board')
                                    }
                                    className="mx-auto px-4 py-2 bg-gradient-end mt-4 rounded-3xl text-white font-bold hover:bg-pink-300"
                                >
                                    데이트 계획 추가하기
                                </button>
                            )}
                        </div>
                    </div>
                    {/* 상세 정보 */}
                    <div
                        className={`p-[10px] bg-slate-500 max-w-md text-white relative rounded-lg mt-16 mx-auto h-[45vh] ${
                            isDetailsVisible ? '' : 'hidden'
                        }`}
                    >
                        <div className="flex flex-col bg-slate-300 h-[40vh]">
                            <span className="bg-slate-500 text-white m-1 p-1">
                                나이 : {users[userIndex]?.age}
                            </span>
                            <span className="bg-slate-500 text-white m-1 p-1">
                                성별 : {users[userIndex]?.gender}
                            </span>
                            <span className="bg-slate-500 text-white m-1 p-1">
                                학력 : {users[userIndex]?.education}
                            </span>
                            <span className="bg-slate-500 text-white m-1 p-1">
                                MBTI : {users[userIndex]?.mbti}
                            </span>
                        </div>
                        <div className="bubble-tail absolute top-5 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0"></div>
                    </div>
                    {/* <div className="absolute top-[-20px] right-[-20px]">
                        <Pin />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Match;
