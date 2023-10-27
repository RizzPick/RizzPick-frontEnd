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
        <div className="w-5/6 h-[100vh] p-4 mt-6 mx-auto">
            <div className="flex flex-col items-center mt-auto">
                <h1 className="text-3xl font-bold ">나의 데이트 계획</h1>
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-7"
                >
                    데이트 계획 작성하러가기!
                </button>
            </div>
            <div>
                <MyPlan myDatings={myDatings} />
            </div>
        </div>
    );
}
