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
        <div className={`bg-[#FFA438] w-full h-[100vh] flex flex-col items-center relative overflow-hidden ${loaded ? 'animate-fadeIn' : ''}`}>
            <header className="flex justify-between w-full p-4">
                <h2 className={`text-3xl font-bold text-white transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>Will you</h2>
                <h2 className={`text-3xl font-bold text-white cursor-pointer transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`} onClick={() => router.push('/signin')}>로그인</h2>
            </header>
            <Image src={MainImage} alt="메인페이지" layout="fill" objectFit="cover" objectPosition="center" className={`absolute z-0 transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : 'translate-y-full'}`} style={{ top: '250px' }} />

            <div className="flex flex-col z-10 w-[1100px] mt-5">
                <div className="flex items-baseline justify-end gap-10">
                    <h1 className={`text-white text-4xl font-bold mt-5 mb-4 transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>나만의 데이트 아이디어,</h1>
                    <h1 className={`text-white font-bold text-[100px] ml-[200px] transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>Will You</h1>
                </div>
                <div className="flex justify-end">
                    <h2 className={`text-white text-3xl mb-4 font-bold transform transition-transform duration-1000 ${loaded ? 'translate-y-0' : '-translate-y-full'}`}>같이 공유하실래요?</h2>
                </div>
                <div className="flex justify-end mb-5">
                    <button onClick={() => router.push('/signin')} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-10 rounded-full">
                        시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}
