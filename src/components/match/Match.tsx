'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { MatchAPI } from '../../features/match/match';
import { UserProfile } from '../../types/match/type';
import Image from 'next/image';

import profiledog from '../../../public/images/profiledog.jpeg';
import profiledog1 from '../../../public/images/profiledog1.jpeg';

// ICON
import WhiteHeartIcon from '../../../public/matchIcon/whiteHeart.svg';
import BadIcon from '../../../public/matchIcon/bad.svg';
import ReadMore from '../../../public/matchIcon/readMore.svg';
import Pin from '../../../public/matchIcon/pin.svg';
import BlackHeartIcon from '../../../public/matchIcon/blackHeart.svg';
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import PageIcon from '../../../public/matchIcon/pageIcon.svg';
import NowPageIcon from '../../../public/matchIcon/nowPage.svg';

import { getCookie } from '@/utils/cookie';

function Match({ userId }: { userId: string }) {
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

    return (
        <div className="flex h-[92.2vh]">
            <div className="flex-1 flex justify-evenly items-start p-10">
                {/*! 유저 정보 */}
                <div className="flex-1 max-w-md rounded-full h-[80vh]">
                    {/* 유저 이미지 */}

                    <div className="relative h-[695px] w-[463px] overflow-hidden">
                        {/* 이미지 개수, 현재 페이지 보여주기 */}
                        <div className="flex justify-center mt-4">
                            {currentUser // currentUser가 정의된 경우에만 map 함수를 호출
                                ? currentUser.profileImages.map((_, index) => (
                                      <div key={index} className="mx-1 z-50">
                                          {index === slideIndex ? (
                                              <NowPageIcon />
                                          ) : (
                                              <PageIcon />
                                          )}
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
                        <div className="absolute w-full bottom-[150px] bg-[#fff] h-[110px] rounded-3xl left-0 flex flex-col">
                            <div className="flex flex-col items-center">
                                <div>
                                    <div className="text-4xl font-bold">
                                        {users[userIndex]?.nickname ??
                                            'Unknown'}
                                    </div>
                                    &nbsp; &nbsp;
                                    <span className="mt-2">
                                        {users[userIndex]?.age ?? 'Unknown'}세
                                    </span>
                                    <button
                                        className="absolute z-50 mr-4"
                                        onClick={toggleDetailsVisibility}
                                    >
                                        <ReadMore />
                                    </button>
                                </div>
                                <div className=""> 안녕하세요 반가워요!</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 데이트 계획 및 상세 정보 */}
                <div
                    className={`flex-1 max-w-md p-6 bg-[#A627A9] rounded-2xl shadow-lg h-[45vh] relative mr-[60px] ${
                        isDetailsVisible ? '' : 'hidden'
                    }`}
                >
                    {/* 데이트 계획 */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            나랑 이런 데이트 어때요?
                        </h2>
                        <div className="bg-white rounded-2xl p-4 h-[30vh] flex flex-col">
                            <span>💭 밥먹고 영화보기</span>
                            <span>💭 밥먹고 영화보기</span>
                            <span>💭 밥먹고 영화보기</span>
                            <span>💭 밥먹고 영화보기</span>
                        </div>
                        <button className="absolute right-[15px]">
                            <BlackHeartIcon />
                        </button>
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
                    <div className="absolute top-[-20px] right-[-20px]">
                        <Pin />
                    </div>
                </div>
                {/* 좋아요, 싫어요 버튼 */}
                <div className="absolute w-1/4 bottom-0 left-50 h-56 text-white flex justify-between">
                    <button
                        className="mt-[100px] mx-[20px] hover-shadow"
                        onClick={handleButtonClick}
                    >
                        <BadIcon />
                    </button>
                    <button
                        className="mt-[100px] mx-[20px] hover-shadow"
                        onClick={handleButtonClick}
                    >
                        <WhiteHeartIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Match;
