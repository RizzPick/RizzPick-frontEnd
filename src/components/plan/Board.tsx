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
        <div className="min-h-screen w-full mx-auto bg-board-bg">
            <div className="relative z-0 inset-x-0 top-[0px] h-[80px] mb-[-50px] min-w-full bg-white"></div>
            <div className="flex flex-col items-center mt-auto">
                <div className="w-[630px] h-[80px] p-[10px] flex justify-center items-center gap-2.5 rounded-[40px] bg-white z-50">
                    <h1 className="text-3xl font-bold ">
                        💜나랑 이런 데이트 어때요?💜
                    </h1>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="bg-button-bg text-white font-bold p-[10px] rounded m-7 w-[287px] gap-2.5 items-center justify-center"
                    >
                        <span className="">데이트 계획 작성하러가기!</span>
                    </button>
                    <button
                        type="button"
                        onClick={myPlanHandleClick}
                        className="bg-button-bg text-white font-bold p-[10px] rounded m-7 gap-2.5 items-center justify-center"
                    >
                        내 글 보러가기!
                    </button>
                </div>
            </div>
            <div className="ml-[182px] mr-[122px]">
                <DatingGrid datings={currentPageData} />
            </div>
            <div className="pagination flex justify-center">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(index + 1)}
                        style={{
                            fontWeight:
                                currentPage === index + 1 ? 'bold' : 'normal',
                        }}
                        className="px-4 py-2"
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
