'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import MainImage from '../../public/images/Main.png';
import { useRouter } from 'next/navigation';
import RizzPickLogo from '../../public/RizzPickLogo.png';
import { useMediaQuery } from 'react-responsive';

export default function Home() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const isMobile = useMediaQuery({
        query: '(max-width:393px)',
    });

    const LoadingIndicator = () => (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-[#062643]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#a627a9]/50 via-[#9015db]/38 via-[#b122c8]/53 via-[#6721c1]/40 to-[#262d6d]/30" />
            <div className="w-[132px] h-[85px] relative animate-pulse animate-once animate-ease-in-out">
                    <Image
                        src={RizzPickLogo}
                        alt="로고"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        sizes="(max-width: 393px) 71px, (max-width: 1200px) 30vw, 350px"
                        onLoadingComplete={() => setLoaded(true)}
                    />
                </div>
        </div>
    );

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col items-center justify-center h-screen w-full bg-[#062643]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#a627a9]/50 via-[#9015db]/38 via-[#b122c8]/53 via-[#6721c1]/40 to-[#262d6d]/30" />
                    <div className="relative w-32 h-20 mx-auto">
                        <Image
                            src={RizzPickLogo}
                            alt="리즈픽 로고"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            sizes="(max-width: 393px) 71px, (max-width: 1200px) 30vw, 350px"
                        />
                    </div>
                    <div className="items-center flex-col mt-40 flex z-20 gap-6">
                        <button
                            onClick={() => router.push('/signin')}
                            className="cursor-pointer bg-white text-fuchsia-600 font-semibold py-1 px-12 rounded-full text-2xl z-10"
                        >
                            시작하기
                        </button>
                        <button
                            onClick={() => router.push('/signup')}
                            className="bg-fuchsia-600 text-white font-semibold py-1 px-12 rounded-full text-2xl z-10"
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            ) : null}
            <div
                className={`w-full h-screen flex flex-col bg-[#062643] items-center overflow-hidden relative justify-center`}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#a627a9]/50 via-[#9015db]/38 via-[#b122c8]/53 via-[#6721c1]/40 to-[#262d6d]/30" />
                <header className="flex justify-between w-full p-4">
                    <div
                        className={`text-white transform transition-transform duration-1000 flex flex-row items-center`}
                    >
                        <div className="w-[71px] h-[43px] relative cursor-pointer">
                            <Image
                                src={RizzPickLogo}
                                alt="로고"
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 393px) 71px, (max-width: 1200px) 30vw, 350px"
                            />
                        </div>
                        <div
                            className="text-3xl text-white font-bold ml-10 cursor-pointer"
                            onClick={() => router.push('/about')}
                        >
                            소개
                        </div>
                    </div>
                    <h2
                        className={`text-3xl font-bold text-white cursor-pointer transform transition-transform duration-1000`}
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
                    className={`absolute z-0 transform transition-transform duration-1000 pointer-events-none`}
                    style={{
                        top: '-100px',
                        left: '-400px',
                        objectFit: 'cover',
                        scale: 1.6,
                        objectPosition: 'top',
                        opacity: '60%',
                    }}
                    onLoadingComplete={() =>
                        setTimeout(() => setLoaded(true), 2000)
                    }
                />
                <div className="flex flex-col items-center mt-20 h-[100vh] w-full z-10 gap-4">
                    <div>
                        <h1 className={`text-white text-4xl font-bold`}>
                            매력적인 데이트,
                        </h1>
                    </div>
                    <div>
                        <h2 className={`text-white text-3xl mb-4 font-bold`}>
                            맞춤형 매치
                        </h2>
                    </div>
                    <div className="mt-10">
                        <h2 className={`text-white text-3xl font-bold`}>
                            그 시작은&nbsp;_
                        </h2>
                    </div>
                    <div>
                        <h2
                            className={`text-white text-[96px] mb-4 font-black`}
                        >
                            RizzPick!
                        </h2>
                    </div>
                    <div className="flex bg-fuchsia-600 rounded-3xl shadow-inner">
                        <button
                            onClick={() => router.push('/signin')}
                            className="text-3xl cursor-pointer text-white font-semibold py-3 px-20 rounded-full z-10"
                        >
                            시작하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
