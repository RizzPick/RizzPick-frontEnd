'use client'
import ProfileAPI from '@/features/profile';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes, ProfileForm } from '@/types/profile';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

function UserProfileEdit({onNext} : any) {
  const { data : profile } = useSWR<MyProfileRes>(PROFILE_KEY);
  const { setCurrentProfile } = UseProfile();
  const { register, handleSubmit, setValue, formState: {errors}, getValues } = useForm<ProfileForm>();
  const [localProfile, setLocalProfile] = useState<MyProfileRes | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    const profileFormKeys: (keyof ProfileForm)[] = [
        'nickname',
        'age',
        'education',
        'gender',
        'location',
        'religion',
        'mbti',
        'intro',
      ];
      if (localProfile) {
        for (const key of profileFormKeys) {
          const currentValue = getValues(key); // getValues를 사용하여 현재 값 가져오기
          if (localProfile[key] !== undefined && !currentValue) {
            setValue(key, localProfile[key]);
          }
        }
      }
  }, [localProfile, setValue, getValues]);

  const onSubmit = async(data: ProfileForm) => {
    try {
      const response = await ProfileAPI.updateProfile(data);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
        setLocalProfile(response.data.data);
        alert('프로필 등록이 완료되었습니다!');
        router.push('/profile');
      }
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  };

  const onPrev = async(event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = getValues();
    try {
      const response = await ProfileAPI.updateProfile(data);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
        setLocalProfile(response.data.data);
        onNext();
      }
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  };



  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='sm:bg-gradient-to-br from-fuchsia-400 via-purple-400 to-indigo-400 md:bg-white lg:bg-white px-8 py-4 rounded-xl border border-black sm:border-none'>
        <div className="mb-4">
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2 px-1">닉네임</label>
          {errors.nickname && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <input {...register("nickname", {required : true})} className="w-full h-10 p-3 border rounded-3xl" placeholder="닉네임을 입력하세요" />
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">나이</label>
          {errors.age && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <select {...register("age", {required:true})} className="w-20 h-10 px-3 border rounded-3xl">
            <option value="">나이</option>
            {/* 예시로 18~30세까지 옵션 추가 (필요에 따라 수정) */}
            {Array.from({ length: 13 }, (_, i) => i + 18).map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">성별</label>
          {errors.gender && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <div className='flex gap-4'>
            <button type='button' className="w-16 h-10 bg-white rounded-3xl border border-neutral-400">남성</button>
            <button type='button' className="w-16 h-10 bg-white rounded-3xl border border-neutral-400">여성</button>
          <select {...register("gender", {required :true})} className="w-20 text-center border rounded-3xl" >
            <option value="">더보기</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="TRANSGENDER">트랜스젠더</option>
          </select>
          </div>
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">한줄 소개</label>
          </div>
          <textarea {...register("intro")} rows={2} className='text-sm w-full px-2 py-1 h-16 bg-white rounded-2xl border border-neutral-400' placeholder='나는 어떤 사람 인가요?'/>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-stone-600 text-base font-medium font-['SUITE'] leading-none tracking-wide">선택 사항</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <label className="block text-gray-700 mb-2">학교</label>
          <input {...register("education")} className="w-44 h-10 bg-white rounded-3xl border border-neutral-400 text-center" placeholder="학교를 입력하세요" />


          <label className="block text-gray-700 my-2">지역</label>
          <select {...register("location")} className="w-36 h-10 bg-white rounded-3xl border border-neutral-400 text-center">
            <option value="">선택</option>
            <option value="SEOUL">서울특별시</option>
            <option value="BUSAN">부산광역시</option>
            <option value="INCHEON">인천광역시</option>
            <option value="DAEGU">대구광역시</option>
            <option value="DAEJEON">대전광역시</option>
            <option value="GWANGJU">광주광역시</option>
            <option value="ULSAN">울산광역시</option>
          </select>

          <label className="block text-gray-700 my-2">MBTI</label>
          <select {...register("mbti")} className="w-24 h-10 bg-white rounded-3xl border border-neutral-400 text-center">
          <option value="">선택</option>
            <option value="ISTJ">ISTJ</option>
            <option value="ISFJ">ISFJ</option>
            <option value="INFJ">INFJ</option>
            <option value="INFP">INFP</option>
            <option value="INTJ">INTJ</option>
            <option value="ISTP">ISTP</option>
            <option value="ISFP">ISFP</option>
            <option value="INTP">INTP</option>
            <option value="ESTP">ESTP</option>
            <option value="ESFP">ESFP</option>
            <option value="ENFP">ENFP</option>
            <option value="ENTP">ENTP</option>
            <option value="ESTJ">ESTJ</option>
            <option value="ESFJ">ESFJ</option>
            <option value="ENFJ">ENFJ</option>
            <option value="ENTJ">ENTJ</option>
          </select>

          <label className="block text-gray-700 my-2">종교</label>
          <select {...register("religion")} className="w-28 h-10 bg-white rounded-3xl border border-neutral-400 text-center" >
            <option value="">선택</option>
            <option value="OTHERS">무교</option>
            <option value="CHRISTIANITY">기독교</option>
            <option value="JUDAISM">유대교</option>
            <option value="ISLAM">이슬람교</option>
            <option value="CATHOLICISM">천주교</option>
            <option value="HINDUISM">힌두교</option>
            <option value="BUDDHISM">불교</option>
            <option value="CONFUCIANSM">유교</option>
          </select>
        </div>
        <div className='flex justify-end'>
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200 sm:hidden">제출하기</button>
        <button type='button' onClick={onPrev} className="text-stone-500 text-base font-medium font-['SUITE'] leading-none tracking-wide relative bottom-0 w-24 h-10 bg-white rounded-3xl transition duration-200 hidden sm:block hover:bg-neutral-200 hover:shadow shadow-inner">다음</button>
        </div>
      </form>
      </div>
  )
}

export default UserProfileEdit