'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import MainImage from '../../public/images/mainPage.png';
import { useRouter } from 'next/navigation';
import Logo from '../../public/Logo.png';

export default function Home() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);

    const LoadingIndicator = () => (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-[#062643]">
            <div className='absolute inset-0 bg-gradient-to-b from-[#a627a9]/50 via-[#9015db]/38 via-[#b122c8]/53 via-[#6721c1]/40 to-[#262d6d]/30'/>
            <div className="w-[95px] h-[40px] relative animate-pulse animate-once animate-ease-in-out">
                    <Image
                        src={Logo}
                        alt="로고"
                        fill
                        style={{ objectFit: 'cover' }}
                        onLoadingComplete={() => setTimeout(() => setLoaded(true), 2000)}
                    />
                </div>
        </div>
    );

    return (
        <div
            className={`w-full height-screen-vh flex flex-col bg-[#062643] items-center overflow-hidden relative ${
                loaded ? 'animate-fadeIn' : ''
            }`}
        >
            <div className='absolute inset-0 bg-gradient-to-b from-[#a627a9]/50 via-[#9015db]/38 via-[#b122c8]/53 via-[#6721c1]/40 to-[#262d6d]/30'/>
            <header className="flex justify-between w-full p-4 sm:hidden">
                <div
                    className={`text-white transform transition-transform duration-1000 flex flex-row items-center${
                        loaded ? 'translate-y-0' : '-translate-y-full'
                    }`}
                >
                    <div className="w-[95px] h-[40px] relative cursor-pointer">
                        <Image
                            src={Logo}
                            alt="로고"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className='text-3xl text-white font-bold ml-10 cursor-pointer' onClick={()=>router.push('/about')}>
                        소개
                    </div>
                </div>
                <h2
                    className={`text-3xl font-bold text-white cursor-pointer transform transition-transform duration-1000 ${
                        loaded ? 'translate-y-0' : '-translate-y-full'
                    }`}
                    onClick={() => router.push('/signin')}
                >
                    로그인
                </h2>
            </header>
            {!loaded && <LoadingIndicator />}
            <Image
                src={MainImage}
                alt="메인페이지"
                fill
                priority
                className={`absolute z-0 sm:hidden transform transition-transform duration-1000`}
                style={{
                    top: '450px',
                    left: '-160px',
                    objectFit: 'cover',
                    scale: 1.6,
                    objectPosition:"center"
                }}
                onLoadingComplete={() => setTimeout(() => setLoaded(true), 2000)}
            />
            <div className="flex flex-col items-end w-full mt-5 sm:items-center mr-[400px] sm:mr-0 h-[100vh]">
                <div className="flex items-baseline sm:flex-col sm:items-center sm:py-10 gap-20 sm:gap-10">
                    <h1
                        className={`text-white text-4xl sm:text-[28px] font-bold sm:mt-5 sm:mb-4 transform transition-transform duration-1000 ${
                            loaded ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    >
                        나만의 데이트 아이디어,
                    </h1>
                    <h1
                        className={`text-white font-bold text-[100px] sm:text-[68px] transform transition-transform duration-1000 ${
                            loaded ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    >
                        Will You
                    </h1>
                </div>
                <div className="flex justify-end">
                    <h2
                        className={`text-white text-3xl sm:text-[28px] mb-4 font-bold transform transition-transform duration-1000 ${
                            loaded ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    >
                        같이 공유하실래요?
                    </h2>
                </div>
                <div className="flex justify-end mb-5 sm:justify-center sm:w-[224px] sm:mx-auto sm:flex-col sm:mt-10 sm:gap-5">
                    <button
                        onClick={() => router.push('/signin')}
                        className="cursor-pointer bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-10 rounded-full sm:text-[32px] z-10"
                    >
                        시작하기
                    </button>
                    <button
                        onClick={() => router.push('/signup')}
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-10 rounded-full hidden sm:block sm:text-[32px] z-10"
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}
