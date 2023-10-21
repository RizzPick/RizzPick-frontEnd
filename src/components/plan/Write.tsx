'use client';

import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import {
    createDating,
    updateDating,
    getDatingAuthorId,
    getDatingData,
} from '../../features/plan/dating';
import { getCookie } from '@/utils/cookie';
import { useParams, useSearchParams } from 'next/navigation';
import { ActivityResponse } from '@/types/plan/activity/type';
import { deleteActivity } from '../../features/plan/dating';

export default function Write() {
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
            if (response.status == 200) {
                const activityResponse = await axios.post<ActivityResponse>(
                    `https://willyouback.shop/api/activity/${id}`,
                    {
                        activityContent,
                    },
                    {
                        headers: {
                            Authorization: getCookie('Authorization'),
                            Authorization_Refresh: getCookie(
                                'Authorization_Refresh'
                            ),
                        },
                    }
                );
                console.log(activityResponse);
            }
            setResponseMessage('Post created successfully!');
        } catch (error) {
            console.log('catch:', error);
            setResponseMessage('An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        if (param.slug && typeof param.slug === 'string') {
            fetchDatingData();
        }
    }, [param.slug]);

    const fetchDatingData = async () => {
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
    };

    const getAuthorId = async () => {
        const token = getCookie('Authorization') as string;
        const refreshToken = getCookie('Authorization_Refresh') as string;
        try {
            const response = await axios.get(
                'https://willyouback.shop/api/myProfile',
                {
                    headers: {
                        Authorization: token,
                        Authorization_Refresh: refreshToken,
                    },
                }
            );
            return response.data.userId;
        } catch (error) {
            console.error('Failed:', error);
        }
        return null; // 오류 발생시 null 반환
    };

    const fetchAuthorId = async () => {
        const id = await getAuthorId();
        setAuthorId(id);
    };

    useEffect(() => {
        fetchAuthorId();
    }, []);

    const handleDelete = async () => {
        if (activityId !== null) {
            try {
                const response = await deleteActivity(activityId);
                console.log(response);
                setActivityContent('');
                setActivityId(null);
            } catch (error) {
                console.error('Failed to delete activity:', error);
            }
        }
    };

    const adjustHeight = () => {
        if (inputRef.current) {
            if (theme.length === 0) {
                inputRef.current.style.height = '50px';
            } else {
                inputRef.current.style.height = 'inherit';
                const computed = window.getComputedStyle(inputRef.current);
                const height =
                    parseInt(
                        computed.getPropertyValue('border-top-width'),
                        10
                    ) +
                    parseInt(
                        computed.getPropertyValue('border-bottom-width'),
                        10
                    ) +
                    inputRef.current.scrollHeight;
                inputRef.current.style.height = `${height}px`;
            }
        }
    };

    useEffect(() => {
        async function fetchIds() {
            const id = await getAuthorId();
            setAuthorId(id);

            if (param.slug && typeof param.slug === 'string') {
                const datingData = await getDatingData(param.slug);
                setDatingAuthorId(datingData.userId); // 데이트 작성자의 ID를 설정하십시오.
            }
        }
        fetchIds();
    }, [param.slug]);

    useEffect(() => {
        adjustHeight();
    }, [theme]);

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
            <div className="flex flex-row items-center p-4 w-full">
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
                        <div className="mb-4">
                            <label
                                htmlFor={`activity`}
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                활동:
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={activityContent}
                                onChange={handleActivityChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                                style={{ height: '50px' }}
                                placeholder="활동을 입력하세요"
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
                <div className="flex-col items-center p-4 w-full">
                    <h3 className="">데이트 내용</h3>
                    <div>{activityContent}</div>
                    {activityId !== null && (
                        <button onClick={handleDelete}>x</button>
                    )}
                </div>
            </div>
        </div>
    );
}
