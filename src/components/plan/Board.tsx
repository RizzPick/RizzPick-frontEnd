'use client';

import { useEffect, useState } from 'react';
import { createDating } from '../../features/plan/dating';
import { Dating } from '@/types/plan/board/type';
import DatingGrid from './Grid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { getDatings } from '../../features/plan/dating';

export default function Board() {
    const [datings, setDatings] = useState<Dating[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [datingId, setDatingId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [theme, setTheme] = useState('');
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 640);
        }; // 초기 로드시 화면 크기 확인
        handleResize();

        // resize 이벤트에 핸들러 연결
        window.addEventListener('resize', handleResize);

        // 컴포넌트 언마운트 시 이벤트 핸들러 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const datingData = await getDatings();
                // datingId를 기준으로 내림차순 정렬
                const sortedData = datingData.sort(
                    (a: any, b: any) =>
                        parseInt(b.datingId, 8) - parseInt(a.datingId, 8)
                );
                setDatings(sortedData);
            } catch (error) {
                console.error('Error fetching dating data:', error);
            }
        }
        fetchData();
    }, []);

    //? 작성하기 버튼 (더미 데이터 생성)
    const handleButtonClick = async () => {
        try {
            // 데이터 생성 요청
            const response = await createDating(title, location, theme);
            // 생성된 데이터의 ID를 저장
            const createdDatingId = response.data.datingId;
            router.push(`write/${createdDatingId}`);
        } catch (error) {
            console.error('데이터 생성 오류:', error);
        }
    };

    //? 내 글 보기 버튼
    const myPlanHandleClick = () => {
        router.push('/user/plan/myplan');
    };

    //? 페이지 이동
    const totalPages = Math.ceil(datings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = datings.slice(startIndex, endIndex);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // 페이지를 이동할 때마다 datings 배열을 정렬
        const sortedData = datings.sort(
            (a, b) => parseInt(b.datingId, 10) - parseInt(a.datingId, 10)
        );
        setDatings(sortedData);
    };

    return (
        <div className="overflow-x-hidden">
            <div className="min-h-screen w-full mx-auto bg-board-bg sm:bg-none sm:mb-5 sm:p-0">
                <div className="relative z-0 inset-x-0 top-[0rem] h-[5rem] mb-[-3.125rem] min-w-full bg-white sm:hidden"></div>
                <div className="flex flex-col items-center mt-auto">
                    <div className="w-[39.375rem] h-[5rem] p-[0.625rem] flex justify-center items-center gap-2.5 rounded-[2.5rem] bg-white z-50 sm:text-3xl">
                        <h1 className="text-3xl font-bold ">
                            💜나랑 이런 데이트 어때요?💜
                        </h1>
                    </div>
                    <div className="flex flex-row p-4 gap-4 items-center sm:mt-[-0.625rem] sm:h-full">
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="bg-button-bg text-white text-2xl font-semibold font-['SUITE'] leading-normal w-[17.9375rem] h-11 p-2.5 rounded shadow justify-center items-center gap-2.5 inline-flex sm:w-[5.8125rem] sm:h-[26px] sm:text-base sm:p-[0.625rem]"
                        >
                            {isSmallScreen
                                ? '작성하기'
                                : '데이트 계획 작성하러가기!'}
                        </button>
                        <button
                            type="button"
                            onClick={myPlanHandleClick}
                            className="bg-button-bg text-white text-2xl font-semibold font-['SUITE'] leading-normal w-[11.25rem] h-11 p-2.5 rounded shadow justify-center items-center gap-2.5 inline-flex sm:w-[5.8125rem] sm:h-[26px] sm:text-base sm:p-[0.625rem]"
                        >
                            {isSmallScreen ? '내 글 보기' : '내 글 보러가기!'}
                        </button>
                    </div>
                </div>
                <div className="ml-[11.375rem] mr-[7.625rem] sm:mt-0 sm:ml-6 sm:mr-1">
                    <DatingGrid datings={currentPageData} />
                </div>
                <div className="pagination flex justify-center sm:mt-6">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(index + 1)}
                            style={{
                                fontWeight:
                                    currentPage === index + 1
                                        ? 'bold'
                                        : 'normal',
                            }}
                            className="px-4 py-2"
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
