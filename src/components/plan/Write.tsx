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
        <div className="w-full h-[100vh] mx-auto">
            <div className="w-full flex flex-col items-center">
                <div className="w-full h-[248px] bg-write-bg">
                    <div className="pt-[67px] pl-[200px] leading-[48px] tracking-[3.60px]">
                        <h1 className="text-[36px] text-white font-black">
                            나만의 특별한 데이트 계획을 <br /> 작성해 보세요!
                        </h1>
                    </div>
                </div>
            </div>
            {/* 작성공간 */}
            <div className="w-[1248px] mx-auto">
                <div
                    className="flex flex-row justify-center p-[30px] mb-2 w-[1248px] mt-[-30px] bg-white z-100 gap-[30px] "
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
                <div className="flex flex-col items-center w-[1248px] h-[70vh] relative">
                    <div className="flex flex-col items-center p-4 w-full mb-8">
                        <div className=" flex-col items-center p-4 w-full">
                            {successMessage && (
                                <div className="alert alert-success">
                                    {successMessage}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-row w-full gap-[40px] mb-[36px]">
                                    <div className="w-[574px]">
                                        <label
                                            htmlFor="title"
                                            className="block text-gray-700 text-sm font-normal mb-2"
                                        >
                                            제목
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={title}
                                            onChange={handleTitleChange}
                                            className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="이목을 끄는 이름을 지어주세요!!"
                                        />
                                    </div>
                                    <div className="w-[574px]">
                                        <label
                                            htmlFor="location"
                                            className="block text-gray-700 text-sm font-normal mb-2"
                                        >
                                            위치
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            value={location}
                                            onChange={handleLocationChange}
                                            className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="어디서 만나실건가요?"
                                        />
                                    </div>
                                </div>
                                <div className="w-[554px]">
                                    <label
                                        htmlFor="theme"
                                        className="block text-gray-700 text-sm font-normal mb-2"
                                    >
                                        주제
                                    </label>
                                    <input
                                        type="text"
                                        id="theme"
                                        value={theme}
                                        onChange={handleThemeChange}
                                        className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="어떤 컨셉의 데이트인가요?"
                                    />
                                </div>
                                <div className="absolute bottom-16 flex justify-center items-center w-full h-10 right-[10px]">
                                    <button
                                        className="w-[234px] h-[65px] bg-fuchsia-600 rounded-[30px] text-white text-[32px] font-semibold font-['SUITE'] leading-loose tracking-widest"
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

                    <div className="flex flex-row w-full mx-auto px-8 gap-10">
                        <div className="w-[574px]">
                            <p className="text-[30px] font-medium mb-4">
                                데이트 활동을 작성해주세요 🖌
                            </p>
                            <p className="text-xl font-normal mb-2">
                                데이트 활동
                            </p>
                            <div className="mb-4 flex justify-between items-center w-full">
                                <input
                                    type="text"
                                    id="location"
                                    value={activityContent}
                                    onChange={handleActivityChange}
                                    className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] w-[477px] border shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    style={{ height: '50px' }}
                                    placeholder="활동을 입력하세요"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddActivity}
                                    className="bg-[#DFDAEA] w-[77px] h-[55px] font-normal py-2 px-4 rounded-xl"
                                >
                                    추가
                                </button>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateAreas: `
                    "header . ."
                    "first second third"
                    "fourth fifth ."
                `,
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '10px', // 간격을 조절하려면 이 값을 변경하세요.
                            }}
                        >
                            <p
                                style={{ gridArea: 'header' }}
                                className="text-[30px] font-medium"
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
                                        key={index} // It's better to use unique value like activity.id as a key
                                        style={{ gridArea }}
                                        className="flex justify-between items-center border-[2px] border-activityDelete-button rounded-[30px] p-2 m-1"
                                    >
                                        {activity.content}
                                        <button
                                            type="button"
                                            onClick={
                                                () =>
                                                    deleteActivity(activity.id) // Here, pass activity.id instead of index
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
    );
}
