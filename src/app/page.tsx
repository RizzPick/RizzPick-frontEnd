'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import MainImage from "../../public/images/mainPage.png";
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className={`w-full bg-custom-gradient h-[100vh] flex flex-col items-center relative overflow-hidden sm:py-4 ${loaded ? 'animate-fadeIn' : ''}`}>
            <header className="flex justify-between w-full p-4 sm:hidden">
                <h2 className={`text-3xl font-bold text-white transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>Will you</h2>
                <h2 className={`text-3xl font-bold text-white cursor-pointer transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`} onClick={() => router.push('/signin')}>로그인</h2>
            </header>
            <Image src={MainImage} alt="메인페이지" layout="fill" objectFit="cover" objectPosition="center" className={`absolute z-0 sm:hidden transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : 'translate-y-full'}`} style={{ top: '250px' }} />

            <div className="flex flex-col w-full mt-5">
                <div className="flex items-baseline justify-end sm:flex-col sm:items-center sm:py-20">
                    <h1 className={`text-white text-4xl sm:text-[28px] font-bold mt-5 mb-4 transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>나만의 데이트 아이디어,</h1>
                    <h1 className={`text-white font-bold text-[100px] sm:mt-10 sm:text-[68px] transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>Will You</h1>
                </div>
                <div className="flex justify-end sm:justify-center">
                    <h2 className={`text-white text-3xl sm:text-[28px] mb-4 font-bold transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>같이 공유하실래요?</h2>
                </div>
                <div className="flex justify-end mb-5 sm:justify-center sm:w-[224px] sm:mx-auto sm:flex-col sm:mt-40 sm:gap-5">
                    <button onClick={() => router.push('/signin')} className="cursor-pointer bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-10 rounded-full sm:text-[32px]">
                        시작하기
                    </button>
                    <button onClick={() => router.push('/signup')} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-10 rounded-full hidden sm:block sm:text-[32px]">
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}
