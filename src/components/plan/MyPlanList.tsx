'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDating, getMyDatingData } from '@/features/plan/dating';
import MyPlan from './MyPlan';
import { MyDating } from '@/types/plan/myplan/type';

export default function MyPlanList() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [theme, setTheme] = useState('');
    const [myDatings, setMyDatings] = useState<MyDating[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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
                const data = await getMyDatingData();
                setMyDatings(data);
            } catch (error) {
                console.error('Error fetching my dating data:', error);
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

    return (
        <div className="overflow-x-hidden">
            <div className="min-h-screen w-full mx-auto bg-board-bg sm:bg-none sm:mb-20">
                <div className="relative z-0 inset-x-0 top-[0px] h-[80px] mb-[-50px] min-w-full bg-white sm:hidden"></div>
                <div className="flex flex-col items-center mt-auto">
                    <div className="w-[630px] h-[80px] p-[10px] flex justify-center items-center gap-2.5 rounded-[40px] bg-white z-0 sm:text-3xl">
                        <h1 className="text-3xl font-bold ">
                            🎈 나의 데이트 계획 🎈
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="bg-button-bg text-white text-2xl font-semibold font-['SUITE'] leading-normal w-[287px] my-8 h-11 p-2.5 rounded shadow justify-center items-center gap-2.5 inline-flex sm:w-[93px] sm:h-[26px] sm:text-base sm:p-[10px] sm:mb-6"
                    >
                        {isSmallScreen
                            ? '작성하기'
                            : '데이트 계획 작성하러가기!'}
                    </button>
                </div>
                <div className="ml-[182px] mr-[122px] sm:mt-0 sm:ml-6 sm:mr-1">
                    <MyPlan myDatings={myDatings} />
                </div>
            </div>
        </div>
    );
}
