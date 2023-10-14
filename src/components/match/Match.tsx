'use client';
import { useState, useEffect } from 'react';
import { fetchRandomUser } from '../../features/match/match';
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

import { getCookie, getRefreshToken } from '@/utils/cookie';

export default function Match({ userId }: { userId: string }) {
    const [isDetailsVisible, setDetailsVisible] = useState(false);

    //! 상세 정보 보이기/숨기기 토글 함수
    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    //! 랜덤 매칭
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    const handleButtonClick = async () => {
        const token = getCookie('Authorization');
        const refreshToken = getRefreshToken();

        const randomUser = await fetchRandomUser(
            token as string,
            refreshToken as string
        ); // 토큰을 변수로 전달합니다.
        console.log(randomUser.userId);
        setCurrentUser(randomUser);
    };

    //! 2023.10.13 유저의 정보가 모두 null로 되어있어, userId가 정상적으로 변경되는 지 확인하기위한 용도?
    useEffect(() => {
        if (currentUser) {
            console.log(`User ID: ${currentUser.userId}`);
        }
    }, [currentUser]);

    //! 사진 슬라이드
    const images = [profiledog1, profiledog];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex justify-evenly items-start p-10">
                {/*! 유저 정보 */}
                <div className="flex-1 max-w-md rounded-lg h-[80vh] ml-[60px]">
                    {/* 유저 이미지 */}

                    <div className="relative h-full w-full overflow-hidden rounded-2xl ">
                        {/* 이미지 개수, 현재 페이지 보여주기 */}
                        <div className="flex justify-center mt-4">
                            {images.map((_, index) => (
                                <div key={index} className="mx-1 z-50">
                                    {index === currentIndex ? (
                                        <NowPageIcon />
                                    ) : (
                                        <PageIcon />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 페이지 이동 버튼 */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-50 m-2"
                        >
                            <LeftButton />
                        </button>

                        {/* 이미지 가져오기 */}
                        {images.map((image, index) => (
                            <div
                                className={
                                    index === currentIndex
                                        ? 'slide active'
                                        : 'slide'
                                }
                                key={index}
                            >
                                {index === currentIndex && (
                                    <Image
                                        src={image}
                                        alt="User"
                                        layout="fill"
                                        objectFit="cover"
                                        className="absolute"
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-50 m-2"
                        >
                            <RightButton />
                        </button>

                        {/* 간단한 정보, 설명란 */}
                        <div className="absolute top-0 left-0 text-white font-bold  mt-[380px] mx-[10px] flex flex-col">
                            <div className="flex flex-row">
                                <div className="text-2xl p-[10px] flex items-center w-full">
                                    <span className="text-4xl">
                                        {currentUser?.nickname ?? 'Unknown'}
                                    </span>
                                    &nbsp; &nbsp;
                                    <span className="mt-3">
                                        {currentUser?.age ?? 'Unknown'}
                                    </span>
                                </div>
                                <div className="flex w-[100px]">
                                    <button
                                        className="absolute right-[2px] top-3 z-50"
                                        onClick={toggleDetailsVisibility}
                                    >
                                        <ReadMore />
                                    </button>
                                </div>
                            </div>
                            <span className="p-[10px] z-50">
                                안녕하세요 will you입니다. 잘부탁드립니다.
                            </span>
                        </div>

                        {/* 좋아요, 싫어요 버튼 */}
                        <div className="absolute top-0 left-0 h-56 text-white bg-gradient-to-t from-black to-transparent w-full mt-[420px] flex justify-between">
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

                {/* 데이트 계획 및 상세 정보 */}
                <div className="flex-1 max-w-md p-6 bg-slate-300 rounded-2xl shadow-lg h-[45vh] relative mr-[60px]">
                    {/* 데이트 계획 */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            나랑 이런 데이트 어때요?
                        </h2>
                        <div className="bg-white rounded-2xl p-4 h-[30vh]">
                            💭 밥먹고 영화보기
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
                                위치
                            </span>
                            <span className="bg-slate-500 text-white m-1 p-1">
                                MBTI
                            </span>
                        </div>
                        <div className="bubble-tail absolute top-5 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0"></div>
                    </div>
                    <div className="absolute top-[-20px] right-[-20px]">
                        <Pin />
                    </div>
                </div>
            </div>
        </div>
    );
}
