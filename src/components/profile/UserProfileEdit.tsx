'use client'
import ProfileAPI from '@/features/profile';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes, ProfileForm } from '@/types/profile';
import { setCookie } from '@/utils/cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

function UserProfileEdit({onNext} : any) {
  const { data : profile } = useSWR<MyProfileRes>(PROFILE_KEY);
  const { setCurrentProfile } = UseProfile();
  const { register, handleSubmit, setValue, formState: {errors}, getValues } = useForm<ProfileForm>();
  const [localProfile, setLocalProfile] = useState<MyProfileRes | null>(null);
  const router = useRouter();
  const [introLength, setIntroLength] = useState(0);
  const [educationLength, setEducationLength] = useState(0);

  const handleIntroChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroLength(event.target.value.length);
  };

  const handleEducationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEducationLength(event.target.value.length);
  };

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
        setIntroLength(localProfile.intro?.length || 0);
        setEducationLength(localProfile.education?.length || 0);
        for (const key of profileFormKeys) {
          const currentValue = getValues(key);
          if (localProfile[key] !== undefined && !currentValue) {
            setValue(key, localProfile[key]);
          }
        }
      }
  }, [localProfile, setValue, getValues]);

  const onSubmit = async(data: ProfileForm) => {
    if(profile?.profileImages.length === 0) {
      toast("이미지는 최소 1장 필요합니다", {icon : '📸'});
      return;
    }
    try {
      console.log(data);
      const response = await ProfileAPI.updateProfile(data);
      console.log(response);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
        setLocalProfile(response.data.data);
        toast.success('프로필 등록이 완료되었습니다!');
        setCookie("status", "true");
        router.push('/profile');
      }
    } catch(error) {
      console.log(error);
    }
  };

  const onPrev = async(event: any) => {
    // event.preventDefault();
    const data = getValues();
    try {
      const response = await ProfileAPI.updateProfile(data);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
        setLocalProfile(response.data.data);
        onNext();
      }
    } catch(error) {
      console.log(error);
    }
  };

  function renderNicknameErrorMessages(error: any) {
    switch (error.type) {
      case 'required':
        return <p className="text-red-500 text-[10px]">✱ 닉네임은 필수입니다.</p>;
      case 'maxLength':
        return <p className="text-red-500 text-[10px]">✱ 닉네임은 최대 6자까지 가능합니다.</p>;
      default:
        return null;
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-[605px] h-full sm:ml-0 sm:bg-profile-gradient md:bg-white lg:bg-white px-8 py-4 rounded-xl sm:rounded-3xl border border-black sm:border-none sm:mt-4 sm:w-[100vw] sm:h-full'>
      <h1 className='justify-center text-zinc-800 text-2xl leading-10 tracking-widest mb-3 hidden sm:flex'>프로필 등록</h1>
        <div className="mb-4">
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2 px-1">닉네임</label>
          {errors.nickname && renderNicknameErrorMessages(errors.nickname)}
          </div>
          <input {...register("nickname", {required : true, maxLength: 6,})} className="sm:w-full w-[311px] h-10 p-3 border rounded-3xl" placeholder="닉네임은 최대 6자까지 가능합니다." />
          {/* <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">생년월일</label>
          {errors.age && <p className="text-red-500 text-[10px]">✱ 생년월일은 필수입니다.</p>}
          </div>
          <input
            type="date" // 타입을 'date'로 설정합니다.
            {...register('age', { required: true })}
            className="border rounded-3xl py-2 px-3 w-[150px] text-sm"
            placeholder="YYYYMMDD"
          /> */}
          
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">나이</label>
          {errors.age && <p className="text-red-500 text-[10px]">✱ 나이는 필수입니다.</p>}
          </div>
          <select {...register("age", {required:true})} className="w-20 h-10 px-3 border rounded-3xl">
            <option value="">선택</option>
            {/* 예시로 18~30세까지 옵션 추가 (필요에 따라 수정) */}
            {Array.from({ length: 30 }, (_, i) => i + 18).map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">성별</label>
          {errors.gender && <p className="text-red-500 text-[10px]">✱ 성별은 필수입니다.</p>}
          </div>
          <div className='flex gap-4'>
          <select {...register("gender", {required :true})} className="w-40 text-center border rounded-3xl px-2 py-2" >
            <option value="">선택</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="TRANSGENDER">트랜스젠더</option>
          </select>
          </div>
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">한줄 소개</label>
          {errors.intro && <p className="text-red-500 text-[10px]">✱ 소개글은 30자 내외로 작성부탁드립니다!</p>}
          </div>
          <textarea {...register("intro", { maxLength: 30,})} rows={2} onChange={handleIntroChange} className='text-sm w-full px-2 py-1 h-16 bg-white rounded-2xl border border-neutral-400' placeholder='취미, 관심사를 작성하면 매칭률이 높아져요!'/>
          <p className="text-right text-xs text-gray-600">{introLength}/30</p>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-stone-600 text-base font-medium font-['SUITE'] leading-none tracking-wide">선택 사항</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">학교</label>
          {errors.intro && <p className="text-red-500 text-[10px]">✱ 학교는 20자 내외로 작성부탁드립니다!</p>}
          </div>
          <input {...register("education", {maxLength:20})} onChange={handleEducationChange} className="w-full h-10 bg-white rounded-3xl border border-neutral-400 text-center" placeholder="학교를 입력하세요" />
          <p className="text-right text-xs text-gray-600">{educationLength}/20</p>
          <label className="block text-gray-700 my-2">지역</label>
          <select {...register("location")} className="w-36 h-10 bg-white rounded-3xl border border-neutral-400 text-center">
            <option value="">선택</option>
            <option value="서울특별시">서울특별시</option>
            <option value="부산광역시">부산광역시</option>
            <option value="인천광역시">인천광역시</option>
            <option value="대구광역시">대구광역시</option>
            <option value="대전광역시">대전광역시</option>
            <option value="광주광역시">광주광역시</option>
            <option value="울산광역시">울산광역시</option>
          </select>

          <label className="block text-gray-700 my-2">MBTI</label>
          <select {...register("mbti")} className="w-36 h-10 bg-white rounded-3xl border border-neutral-400 text-center">
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
          <select {...register("religion")} className="w-36 h-10 bg-white rounded-3xl border border-neutral-400 text-center" >
            <option value="">선택</option>
            <option value="무교">무교</option>
            <option value="기독교">기독교</option>
            <option value="유대교">유대교</option>
            <option value="이슬람교">이슬람교</option>
            <option value="가톨릭교">가톨릭교</option>
            <option value="힌두교">힌두교</option>
            <option value="불교">불교</option>
            <option value="유교">유교</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className='flex justify-end'>
        <button className="w-56 h-16 bg-fuchsia-600 rounded-full shadow-inner justify-center items-center absolute bottom-32 right-[24%] sm:hidden text-white text-3xl">저장하기</button>
        <button type='button' onClick={handleSubmit(onPrev)} className="text-stone-500 text-base font-medium font-['SUITE'] leading-none tracking-wide relative bottom-0 w-24 h-10 bg-white rounded-3xl transition duration-200 hidden sm:block hover:bg-neutral-200 hover:shadow shadow-inner">다음</button>
        </div>
      </form>
      </div>
  )
}

export default UserProfileEdit