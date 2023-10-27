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
    const itemsPerPage = 10;
    const [datingId, setDatingId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [theme, setTheme] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function fetchData() {
            try {
                const datingData = await getDatings();
                // datingId를 기준으로 내림차순 정렬
                const sortedData = datingData.sort(
                    (a: any, b: any) =>
                        parseInt(b.datingId, 10) - parseInt(a.datingId, 10)
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
        <div className="w-5/6 h-[100vh] p-4 mt-6 mx-auto">
            <div className="flex flex-col items-center mt-auto">
                <h1 className="text-3xl font-bold ">
                    데이트 계획을 보고 나에게 맞는 이성, 친구를 찾아요!
                </h1>
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-7"
                >
                    데이트 계획 작성하러가기!
                </button>
            </div>
            <div>
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
