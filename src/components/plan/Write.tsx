'use client';

import axios from 'axios';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    createDating,
    updateDating,
    getDatingAuthorId,
    getDatingData,
    createActivity,
} from '../../features/plan/dating';
import { getCookie } from '@/utils/cookie';
import { useParams, useSearchParams } from 'next/navigation';
import { ActivityResponse } from '@/types/plan/activity/type';
import { AllDatingResponse } from '@/types/plan/board/type';
import { DatingInfo } from '@/types/plan/myplan/type';
import DeleteIcon from '../../../public/planIcon/delete.svg';
// import { deleteActivity } from '../../features/plan/dating';
import { Activity } from '../../types/plan/activity/type';
import BackIcon from '../../../public/planIcon/back.svg';

interface WriteProps {
    initialData: DatingInfo;
    initialActivities: Activity[];
    onEditComplete: () => void;
}

export default function Write({
    initialData,
    initialActivities,
    onEditComplete,
}: WriteProps) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [activityContent, setActivityContent] = useState('');
    const [theme, setTheme] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [activityId, setActivityId] = useState<number | null>(null);
    const [authorId, setAuthorId] = useState<number | null>(null);
    const [datingAuthorId, setDatingAuthorId] = useState<number | null>(null);

    const transformedActivities = initialActivities
        ? initialActivities.map((activity) => ({
              id: activity.activityId,
              content: activity.activityContent,
          }))
        : [];
    const [activities, setActivities] = useState(transformedActivities);

    const param = useParams();
    console.log(param);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.value);
    };

    const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActivityContent(e.target.value);
    };

    const handleBackButtonClick = () => {
        history.back();
    };

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

    //? 더미 데이터를 받아요
    const fetchDatingData = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://willyouback.shop/api/dating/${param.slug}`
            );
            const data = response.data.data;
            console.log('Received data:', data);
            if (data) {
                setTitle(data.datingTitle);
                setLocation(data.datingLocation);
                setTheme(data.datingTheme);
            } else {
                console.error('No data received');
            }
        } catch (error) {
            console.error('Failed to fetch dating data:', error);
        }
    }, [param.slug]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Form Submit');
        e.preventDefault();
        try {
            const id = Number(param.slug);
            const response = await axios.put(
                `https://willyouback.shop/api/dating/${id}`,
                { title, location, theme },
                {
                    headers: {
                        Authorization: getCookie('Authorization'),
                        Authorization_Refresh: getCookie(
                            'Authorization_Refresh'
                        ),
                    },
                }
            );
            console.log(response);
            onEditComplete();
        } catch (error) {
            console.log('catch:', error);
            setResponseMessage('An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        if (param.slug && typeof param.slug === 'string') {
            fetchDatingData();
        }
    }, [param.slug, fetchDatingData]);

    const handleAddActivity = async () => {
        if (activityContent) {
            const id = Number(param.slug);
            try {
                const activityResponse = await createActivity(
                    id,
                    activityContent
                );
                if (activityResponse.status === 'success') {
                    setActivities([
                        ...activities,
                        {
                            id: activityResponse.data.activityId,
                            content: activityContent,
                        },
                    ]);
                    setActivityContent('');
                } else {
                    throw new Error('Failed to create an activity');
                }
            } catch (error) {
                console.log('catch:', error);
                setResponseMessage('An error occurred. Please try again.');
            }
        }
    };

    async function deleteActivity(activityId: number) {
        console.log('activityId', activityId);
        try {
            const response = await axios.delete(
                `https://willyouback.shop/api/activity/${activityId}`,
                {
                    headers: {
                        Authorization: getCookie('Authorization'),
                        Authorization_Refresh: getCookie(
                            'Authorization_Refresh'
                        ),
                    },
                }
            );
            if (response.data.status === 'success') {
                setActivities(
                    activities.filter((activity) => activity.id !== activityId)
                );
            } else {
                console.error(
                    'Failed to delete activity:',
                    response.data.message
                );
            }
        } catch (error) {
            console.error('Failed to delete activity:', error);
        }
    }
    console.log('null?', activityId);

    return (
        <div className="overflow-x-hidden">
            <div className="hidden sm:block">
                <div className="flex flex-row h-20 items-center">
                    <button onClick={handleBackButtonClick} className="p-4">
                        <BackIcon />
                    </button>
                    <p className="text-neutral-700 text-xl font-medium leading-tight tracking-wide mx-28">
                        계획작성
                    </p>
                </div>
            </div>
            <div className="w-full h-[100vh] mx-auto sm:w-[393px]">
                <div className="w-full flex flex-col items-center">
                    <div className="w-full h-[248px] bg-write-bg sm:bg-none sm:h-10">
                        <div className="pt-[67px] pl-[200px] leading-[48px] tracking-[3.60px] sm:p-0 sm:w-[393px] sm:h-10 sm:justify-center sm:items-center sm:gap-2.5 sm:inline-flex">
                            <h1 className="text-[36px] text-white font-black sm:text-black sm:text-xl sm:font-semibold sm:leading-tight sm:tracking-wide">
                                {isSmallScreen
                                    ? '나만의 데이트 계획을 작성해 보세요!'
                                    : '나만의 특별한 데이트 계획을 <br /> 작성해보세요!'}
                            </h1>
                        </div>
                    </div>
                </div>
                {/* 작성공간 */}
                <div className="max-w-[1248px] mx-auto sm:w-[393px]">
                    <div
                        className="flex flex-row justify-center p-[30px] mb-2 w-[1248px] mt-[-30px] bg-white z-100 gap-[30px] sm:hidden "
                        style={{
                            position: 'relative',
                            borderRadius: '30px 30px 0px 0px',
                        }}
                    >
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #식사🍚
                        </p>
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #영화🎬
                        </p>
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #문화/예술🎨
                        </p>
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #스포츠🏀️
                        </p>
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #힐링🌿
                        </p>
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #활동⚙️
                        </p>
                        <p className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px]">
                            #일상🎧
                        </p>
                    </div>
                    <div
                        className="flex flex-col items-center w-[1248px] h-[80vh] relative "
                        style={{
                            height: isSmallScreen
                                ? `calc(70vh + ${activities.length * 6}vh)`
                                : 'h-100vh',
                        }}
                    >
                        <div className="flex flex-col items-center p-4 w-full mb-8">
                            <div className=" flex-col items-center p-4 w-full">
                                {successMessage && (
                                    <div className="alert alert-success">
                                        {successMessage}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-row w-full gap-[40px] mb-[36px] sm:flex-col sm:gap-4 sm:mb-4">
                                        <div className="w-[574px]">
                                            <label
                                                htmlFor="title"
                                                className="block text-gray-700 text-sm font-normal mb-2 sm:ml-2 sm:text-lg"
                                            >
                                                제목
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                value={title}
                                                onChange={handleTitleChange}
                                                className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[345px] sm:h-[40px]"
                                                placeholder="이목을 끄는 이름을 지어주세요!!"
                                            />
                                        </div>
                                        <div className="w-[574px]">
                                            <label
                                                htmlFor="location"
                                                className="block text-gray-700 text-sm font-normal mb-2 sm:ml-2 sm:text-lg"
                                            >
                                                위치
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                value={location}
                                                onChange={handleLocationChange}
                                                className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[345px] sm:h-[40px]"
                                                placeholder="어디서 만나실건가요?"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-[554px]">
                                        <label
                                            htmlFor="theme"
                                            className="block text-gray-700 text-sm font-normal mb-2 sm:ml-2 sm:text-lg"
                                        >
                                            주제
                                        </label>
                                        <input
                                            type="text"
                                            id="theme"
                                            value={theme}
                                            onChange={handleThemeChange}
                                            className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[345px] sm:h-[40px]"
                                            placeholder="어떤 컨셉의 데이트인가요?"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 flex justify-center items-center w-full h-10 right-[10px] sm:justify-normal sm: left-32">
                                        <button
                                            className="w-[234px] h-[65px] mr-[260px] mb-[100px] bg-fuchsia-600 rounded-[30px] text-white text-[32px] font-semibold font-['SUITE'] leading-loose tracking-widest sm:text-xl sm:w-[130px] sm:h-10"
                                            style={{
                                                display:
                                                    authorId === datingAuthorId
                                                        ? 'block'
                                                        : 'none',
                                            }}
                                        >
                                            작성완료
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex flex-row w-full mx-auto px-8 gap-10 sm:gap-0 sm:flex-col">
                            <div className="w-[574px] sm:w-[393px]">
                                <p className="text-[30px] font-medium mb-4 sm:text-xl">
                                    데이트 활동을 작성해주세요 🖌
                                </p>
                                <p className="text-xl font-normal mb-2 sm:hidden">
                                    데이트 활동
                                </p>
                                <div className="mb-4 flex justify-between items-center w-full sm:justify-normal">
                                    <input
                                        type="text"
                                        id="location"
                                        value={activityContent}
                                        onChange={handleActivityChange}
                                        className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[248px] sm:h-[40px] sm:py-0"
                                        placeholder="활동을 입력하세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddActivity}
                                        className="bg-[#DFDAEA] w-[77px] h-[55px] font-normal py-2 mx-2 rounded-xl sm:ml-2 sm:w-[82px] sm:h-[40px]"
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>
                            <div
                                className={`p-2 ${
                                    isSmallScreen
                                        ? 'grid grid-cols-1 gap-10'
                                        : ''
                                }`}
                                style={{
                                    display: 'grid',
                                    gridTemplateAreas: isSmallScreen
                                        ? `
                                        "first"
                                        "second"
                                        "third"
                                        "fourth"
                                        "fifth"
                                    `
                                        : `
                                        "header . ."
                                        "first second third"
                                        "fourth fifth ."
                                    `,
                                    gridTemplateColumns: isSmallScreen
                                        ? '1fr'
                                        : '1fr 1fr 1fr',
                                    gap: '10px',
                                }}
                            >
                                <p
                                    style={{ gridArea: 'header' }}
                                    className="text-[30px] font-medium sm:hidden"
                                >
                                    데이트 내용🎈
                                </p>
                                {activities.map((activity, index) => {
                                    console.log('activity:', activity);
                                    const gridArea =
                                        index === 0
                                            ? 'first'
                                            : index === 1
                                            ? 'second'
                                            : index === 2
                                            ? 'third'
                                            : index === 3
                                            ? 'fourth'
                                            : 'fifth';
                                    return (
                                        <div
                                            key={index}
                                            style={{ gridArea }}
                                            className="flex justify-between items-center border-[2px] border-activityDelete-button rounded-[30px] px-2 m-1 sm:text-sm sm:max-w-[300px] sm:py-1 "
                                        >
                                            {activity.content}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteActivity(activity.id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
