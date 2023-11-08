'use client';

// import axios from 'axios';
import { useState, useEffect, useRef, useCallback } from 'react';
// import { createActivity } from '../../features/plan/dating';
// import { getCookie } from '@/utils/cookie';
import { PlanAPI } from '../../features/plan/dating';
import { useParams, useSearchParams } from 'next/navigation';
// import { ActivityResponse } from '@/types/plan/activity/type';
// import { AllDatingResponse } from '@/types/plan/board/type';
import { DatingInfo } from '@/types/plan/myplan/type';
import DeleteIcon from '../../../public/planIcon/delete.svg';
// import { deleteActivity } from '../../features/plan/dating';
import { Activity } from '../../types/plan/activity/type';
import BackIcon from '../../../public/planIcon/back.svg';
import toast from 'react-hot-toast';

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
    const [title, setTitle] = useState<string>(initialData.datingTitle);
    const [location, setLocation] = useState<string>(
        initialData.datingLocation
    );
    const [theme, setTheme] = useState<string>(initialData.datingTheme);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [activityContent, setActivityContent] = useState('');
    const [activityId, setActivityId] = useState<number | null>(null);
    const [authorId, setAuthorId] = useState<number | null>(null);
    const [datingAuthorId, setDatingAuthorId] = useState<number | null>(null);

    const [successMessage, setSuccessMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const transformedActivities = initialActivities
        ? initialActivities.map((activity) => ({
              id: activity.activityId,
              content: activity.activityContent,
          }))
        : [];
    const [activities, setActivities] = useState(transformedActivities);

    const param = useParams();

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
        const slug = Array.isArray(param.slug) ? param.slug[0] : param.slug;
        try {
            const data = await PlanAPI.fetchDatingData(slug);
            console.log('Received data:', data);
        } catch (error) {
            console.error('Failed to fetch dating data:', error);
        }
    }, [param.slug]);

    //? 더미 데이터 수정하기 (유저 = 작성하기)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Form Submit');
        e.preventDefault();
        //! activity는  1개 이상 추가 되어야 합니다.
        if (activities.length < 1) {
            setResponseMessage(
                'Please add at least one activity before submitting.'
            );
            toast.error('1개 이상의 활동을 추가해주세요');
            return;
        }
        try {
            const id = Number(param.slug);
            const response = await PlanAPI.updateDatingData(id.toString(), {
                title,
                location,
                theme,
            });
            console.log(response);
            onEditComplete();
            handleBackButtonClick();
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

    const handleThemeTagClick = (themeTag: string) => {
        const tagWithoutHash = themeTag.replace('#', '.');
        if (selectedTags.includes(tagWithoutHash)) {
            // 이미 선택된 태그라면 제거합니다.
            setSelectedTags(
                selectedTags.filter((tag) => tag !== tagWithoutHash)
            );
            // 주제에서도 해당 태그를 제거합니다.
            setTheme(theme.replace(`${tagWithoutHash} `, ''));
        } else {
            // 새로운 태그라면 추가합니다.
            setSelectedTags([...selectedTags, tagWithoutHash]);
            // 주제에도 해당 태그를 추가합니다.
            setTheme(theme ? `${theme} ${tagWithoutHash}` : tagWithoutHash);
        }
    };

    const handleAddActivity = async () => {
        if (activities.length >= 5) {
            // 활동이 5개까지만 추가 가능
            toast.error('활동은 최대 5개까지만 가능합니다❗️');
            return;
        }
        if (activityContent) {
            const id = Number(param.slug);
            try {
                const activityResponse = await PlanAPI.createActivity(
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

    const deleteActivity = async (id: number) => {
        try {
            const response = await PlanAPI.deleteActivity(id);
            if (response.status === 200) {
                // response.data.status를 response.status로 변경
                setActivities(
                    activities.filter((activity) => activity.id !== id) // activityId를 id로 변경
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
        console.log('null?', id);
    };

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
                        <div className="pt-[67px] pl-[200px] leading-[48px] tracking-[3.60px] sm:p-0 sm:w-[363px] sm:h-10 sm:justify-center sm:items-center sm:gap-2.5 sm:inline-flex">
                            <h1 className="text-[36px] text-white font-black sm:text-black sm:text-xl sm:font-semibold sm:leading-tight sm:tracking-wide">
                                {isSmallScreen ? (
                                    '나만의 데이트 계획을 작성해 보세요!'
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: '나만의 특별한 데이트 계획을 <br /> 작성해보세요!',
                                        }}
                                    />
                                )}
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
                        <div
                            className={`border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer`}
                            onClick={() => handleThemeTagClick('#식사🍚')}
                        >
                            #식사🍚
                        </div>
                        <p
                            className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer"
                            onClick={() => handleThemeTagClick('#영화🎬')}
                        >
                            #영화🎬
                        </p>
                        <p
                            className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer"
                            onClick={() => handleThemeTagClick('#문화/예술🎨')}
                        >
                            #문화/예술🎨
                        </p>
                        <p
                            className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer"
                            onClick={() => handleThemeTagClick('#스포츠🏀️')}
                        >
                            #스포츠🏀️
                        </p>
                        <p
                            className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer"
                            onClick={() => handleThemeTagClick('#힐링🌿')}
                        >
                            #힐링🌿
                        </p>
                        <p
                            className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer"
                            onClick={() => handleThemeTagClick('#활동⚙️')}
                        >
                            #활동⚙️
                        </p>
                        <p
                            className="border-[1px] border-[#A627A9] rounded-full py-[6px] px-[30px] hover:cursor-pointer"
                            onClick={() => handleThemeTagClick('#일상🎧')}
                        >
                            #일상🎧
                        </p>
                    </div>
                    <div
                        className="flex flex-col items-center w-[1248px] relative "
                        style={{
                            height: isSmallScreen
                                ? `calc(78cvh + ${
                                      Math.min(activities.length, 5) * 9
                                  }vh)`
                                : '100vh',
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
                                                className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[300px] sm:h-[40px]"
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
                                                className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[300px] sm:h-[40px]"
                                                placeholder="어디서 만나실건가요?"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-[574px]">
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
                                            className="flex h-[55px] py-[16px] px-[20px] rounded-[12px] border shadow appearance-none  w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-[300px] sm:h-[40px]"
                                            placeholder="어떤 컨셉의 데이트인가요?"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 flex justify-center items-center w-full h-10 right-[10px] sm:justify-normal sm: left-32">
                                        <button
                                            className="w-[234px] h-[65px] mr-[260px] mb-[100px] bg-fuchsia-600 rounded-[30px] text-white text-[32px] font-semibold font-['SUITE'] leading-loose tracking-widest sm:text-xl sm:w-[130px] sm:h-10 sm:mt-12"
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
                                <div className="flex justify-between items-center mb-4 w-full">
                                    <input
                                        type="text"
                                        id="activity"
                                        value={activityContent}
                                        onChange={handleActivityChange}
                                        className="w-full h-14 py-2 px-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 sm:w-3/5"
                                        placeholder="활동을 입력하세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddActivity}
                                        className="ml-2 bg-[#DFDAEA] w-20 h-14 rounded-lg text-base font-medium sm:mr-20"
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>
                            <div className="w-2/3 sm:w-1/3">
                                <p className="text-[30px] font-medium mb-4 sm:text-xl">
                                    데이트 내용🎈
                                </p>
                                <div className="space-y-2">
                                    {activities.map((activity, index) => (
                                        <div
                                            key={activity.id}
                                            className="flex justify-between items-center p-2 border-2 border-[#A627A9] rounded-full sm:w-4/5"
                                        >
                                            <p className="break-words overflow-hidden">
                                                {activity.content}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteActivity(activity.id)
                                                }
                                            >
                                                <DeleteIcon className="fill-current text-[#A627A9]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
