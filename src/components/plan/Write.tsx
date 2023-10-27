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
// import { deleteActivity } from '../../features/plan/dating';

interface Activity {
    id: number;
    activityContent: string;
}

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
              id: activity.id,
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
            const id = Number(param.slug); // datingId를 가져옵니다.
            try {
                const activityResponse = await createActivity(
                    id,
                    activityContent
                );
                if (activityResponse.status === 'success') {
                    // 활동 추가 버튼 클릭 시 활동 목록에 새로운 활동 추가
                    setActivities([
                        ...activities,
                        {
                            id: activityResponse.data.activityId,
                            content: activityContent,
                        },
                    ]);
                    setActivityContent(''); // 입력 칸을 비우기
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
        console.log(activityId);
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
            // 응답을 확인하고, 성공적으로 삭제되었는지 확인합니다.
            if (response.data.status === 'success') {
                // activities 상태에서 삭제된 activity를 제거합니다.
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
    console.log('null?', activityId); // activity 객체 로깅

    return (
        <div className=" w-3/4 h-[100vh] p-4 mx-auto">
            <div className="w-full flex flex-col items-center">
                <h1 className="text-2xl p-4">
                    나만의 데이트 계획을 작성해보아요!!
                </h1>
                <div className="flex flex-row items-center p-1 mb-2">
                    <p className="border-[1px] border-[#A627A9] rounded-full p-1 m-1">
                        #식사🍛
                    </p>
                    <p className="border-[1px] border-[#A627A9] rounded-full p-1 m-1">
                        #영화🍿
                    </p>
                    <p className="border-[1px] border-[#A627A9] rounded-full p-1 m-1">
                        #자연⛰️
                    </p>
                    <p className="border-[1px] border-[#A627A9] rounded-full p-1 m-1">
                        #활동💃🏻🕺🏻
                    </p>
                    <p className="border-[1px] border-[#A627A9] rounded-full p-1 m-1">
                        #문화/예술🖼️
                    </p>
                    <p className="border-[1px] border-[#A627A9] rounded-full p-1 m-1">
                        #스포츠⚽️⚾️🏟️
                    </p>
                </div>
            </div>
            <div className="flex flex-row items-center p-4">
                <div className="flex flex-col items-center p-4 w-full">
                    <div className=" flex-col items-center p-4 w-full">
                        {successMessage && (
                            <div className="alert alert-success">
                                {successMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="title"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    제목:
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={handleTitleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="이목을 끄는 이름을 지어주세요!!"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="location"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Location:
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={handleLocationChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="어디서 만나실건가요?"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="theme"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    주제
                                </label>
                                <input
                                    type="text"
                                    id="theme"
                                    value={theme}
                                    onChange={handleThemeChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="어떤 컨셉의 데이트인가요?"
                                />
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                style={{
                                    display:
                                        authorId === datingAuthorId
                                            ? 'block'
                                            : 'none',
                                }}
                            >
                                작성완료!
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col items-center w-full mb-10">
                    <h2 className="text-xl mb-4">데이트 활동을 작성해주세요</h2>
                    <div className="mb-4 flex justify-between items-center w-full">
                        <input
                            type="text"
                            id="location"
                            value={activityContent}
                            onChange={handleActivityChange}
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none flex-grow mr-2"
                            style={{ height: '50px' }}
                            placeholder="활동을 입력하세요"
                        />
                        <button
                            type="button"
                            onClick={handleAddActivity}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            추가
                        </button>
                    </div>
                    <h3 className="">데이트 내용</h3>
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-[1px] border-[blue] rounded-xl p-2 m-1"
                        >
                            {activity.content} {/* 수정된 부분 */}
                            <button
                                type="button"
                                onClick={() => deleteActivity(index)} // 배열 인덱스 사용
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
