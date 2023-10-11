'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import profiledog from '../../../public/images/profiledog.jpeg';
import WhiteHeartIcon from '../../../public/matchIcon/whiteHeart.svg';
import BadIcon from '../../../public/matchIcon/bad.svg';
import ReadMore from '../../../public/matchIcon/readMore.svg';
import Pin from '../../../public/matchIcon/pin.svg';
import BlackHeartIcon from '../../../public/matchIcon/blackHeart.svg';

// import { fetchRandomUser } from '../feature/match/match';

// import { handleNopeButtonClick } from '../feature/nope/nope';
// { userId }: { userId: string } > match에 인자로 들어가야함

export default function Match() {
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    // const [currentUser, setCurrentUser] = useState(null);

    // 상세 정보 보이기/숨기기 토글 함수
    const toggleDetailsVisibility = () => {
        setDetailsVisible(!isDetailsVisible);
    };

    // useEffect(() => {
    //     // Initial fetch
    //     fetchRandomUser().then((user) => setCurrentUser(user));
    // }, []);

    // const handleButtonClick = async () => {
    //     const randomUser = await fetchRandomUser();
    //     setCurrentUser(randomUser);
    // };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex justify-evenly items-start p-10">
                {/* 유저 정보 */}
                <div className="flex-1 max-w-md rounded-lg h-[80vh] ml-[60px]">
                    {/* 유저 이미지 */}

                    <div className="relative h-full w-full overflow-hidden rounded-2xl ">
                        <Image
                            src={profiledog}
                            alt="User"
                            layout="fill"
                            objectFit="cover"
                            className="absolute"
                        />
                        <div className="absolute top-0 left-0 text-white font-bold  mt-[370px] mx-[10px] flex flex-col">
                            <div className="flex flex-row">
                                <div className="text-2xl p-[10px] flex items-center">
                                    <span>김연수</span> &nbsp; <span>25</span>{' '}
                                </div>
                                <div className="flex w-[300px]">
                                    <button
                                        className="absolute right-[2px]"
                                        onClick={toggleDetailsVisibility}
                                    >
                                        <ReadMore />
                                    </button>
                                </div>
                            </div>
                            <span className="p-[10px]">
                                {' '}
                                안녕하세요 will you입니다. 잘부탁드립니다.
                            </span>
                        </div>
                        <div className="absolute top-0 left-0 h-56 text-white bg-gradient-to-t from-black to-transparent w-full mt-[420px] flex justify-between">
                            <button
                                className="mt-[100px] mx-[20px] hover-shadow"
                                // onClick={handleButtonClick}
                            >
                                <BadIcon />
                            </button>
                            <button
                                className="mt-[100px] mx-[20px] hover-shadow"
                                // onClick={handleButtonClick}
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
