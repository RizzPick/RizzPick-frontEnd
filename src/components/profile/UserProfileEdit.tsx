'use client';
import ProfileAPI from '@/features/profile';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes, ProfileForm } from '@/types/profile';
import { setCookie } from '@/utils/cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { isAdult } from '@/utils/dateUtils';
import toast from 'react-hot-toast';
import useSWR from 'swr';

type Props = {
  onNext? : () => void;
}

const hobbies = ["운동","외국어 배우기","요리","독서","산책","낚시","게임","그림","전시회 가기","노래","음악 듣기","영화","런닝","자전거 타기","술","맛집 탐방","쇼핑","드라이브","여행","캠핑","카페","악기"]
const interests = ["문화","예술","과학","여가","레저","스포츠","사회","음식","요리"]

function UserProfileEdit({onNext} : Props) {
  const { data : profile } = useSWR<MyProfileRes>(PROFILE_KEY);
  const { setCurrentProfile } = UseProfile();
  const { register, handleSubmit, setValue, formState: {errors}, getValues } = useForm<ProfileForm>();
  const [localProfile, setLocalProfile] = useState<MyProfileRes | null>(profile || null);
  const router = useRouter();
  const [introLength, setIntroLength] = useState(0);

  const handleIntroChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroLength(event.target.value.length);
    setValue('intro', event.target.value);
  }, [setValue]);


  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }

    const profileFormKeys: (keyof ProfileForm)[] = [
        'nickname',
        'birthday',
        'hobby',
        'interest',
        'gender',
        'location',
        'religion',
        'mbti',
        'intro',
      ];
      if (localProfile) {
        setIntroLength(localProfile.intro?.length || 0);
        for (const key of profileFormKeys) {
          const currentValue = getValues(key);
          if (localProfile[key] !== undefined && !currentValue) {
            setValue(key, localProfile[key]);
          }
        }
     } 
  },[getValues, localProfile, profile, setValue]);

  const onSubmit = useCallback(async(data: ProfileForm) => {
    if (!isAdult(data.birthday)) {
      toast.error('18세 미만은 이 서비스를 사용할 수 없습니다.');
      return;
    }
  
    if(profile?.profileImages.length === 0) {
      toast("이미지는 최소 1장 필요합니다", {icon : '📸'});
      return;
    }
    try {
      const response = await ProfileAPI.updateProfile(data);
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
  },[profile, setCurrentProfile, router]);

  const onPrev = useCallback(async() => {
    const data = getValues();
    try {
      const response = await ProfileAPI.updateProfile(data);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
        setLocalProfile(response.data.data);
        onNext?.();
      }
    } catch(error) {
      console.log(error);
    }
  },[getValues, onNext, setCurrentProfile]);

  const renderNicknameErrorMessages = useCallback((error: { type: string }): JSX.Element | null => {
    switch (error.type) {
      case 'required':
        return <p className="text-red-500 text-[10px]">✱ 닉네임은 필수입니다.</p>;
      case 'maxLength':
        return <p className="text-red-500 text-[10px]">✱ 닉네임은 최대 6자까지 가능합니다.</p>;
      default:
        return null;
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-[605px] h-full sm:ml-0 sm:bg-profile-gradient md:bg-white lg:bg-white px-8 py-4 rounded-xl sm:rounded-3xl border border-black sm:border-none sm:mt-4 sm:w-[100vw] sm:h-full'>
      <h1 className='justify-center text-zinc-800 text-2xl leading-10 tracking-widest mb-3 hidden sm:flex'>{`${profile?.userActiveStatus ? ("프로필 수정"): ("프로필 등록")}`}</h1>
        <div className="mb-4">
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2 px-1">닉네임</label>
          {errors.nickname && renderNicknameErrorMessages(errors.nickname)}
          </div>
          <input {...register("nickname", {required : true, maxLength: 6,})} className="sm:w-full w-[311px] h-10 p-3 border rounded-3xl" placeholder="닉네임은 최대 6자까지 가능합니다." />
          <div className='flex justify-between mt-2'>
          <label className="block text-gray-700 mb-2">생년월일</label>
          {errors.birthday && <p className="text-red-500 text-[10px]">✱ 생년월일은 필수입니다.</p>}
          </div>
          <input
            type="date"
            {...register('birthday', { required: true })}
            className="border rounded-3xl py-2 px-3 w-[150px] text-sm"
          />
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
          <textarea {...register("intro", { maxLength: 30,})} rows={2} onChange={handleIntroChange} className='resize-none text-sm w-full px-2 py-1 h-16 bg-white rounded-2xl border border-neutral-400' placeholder='취미, 관심사를 작성하면 매칭률이 높아져요!'/>
          <p className="text-right text-xs text-gray-600">{introLength}/30</p>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-stone-600 text-base font-medium font-['SUITE'] leading-none tracking-wide">선택 사항</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
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
            <option value="세종시">세종시</option>
            <option value="경기도">경기도</option>
            <option value="강원도">강원도</option>
            <option value="충청북도">충청북도</option>
            <option value="충청남도">충청남도</option>
            <option value="전라북도">전라북도</option>
            <option value="전라남도">전라남도</option>
            <option value="경상북도">경상북도</option>
            <option value="경상남도">경상남도</option>
            <option value="제주도">제주도</option>
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

          <label className="block text-gray-700 my-2">취미</label>
            <select {...register("hobby")} className="w-36 h-10 bg-white rounded-3xl border border-neutral-400 text-center">
              <option value="">선택</option>
              {hobbies.map(hobby => (
                <option key={hobby} value={hobby}>{hobby}</option>
              ))}
            </select>

            <label className="block text-gray-700 my-2">관심사</label>
            <select {...register("interest")} className="w-36 h-10 bg-white rounded-3xl border border-neutral-400 text-center">
              <option value="">선택</option>
              {interests.map(interest => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
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

export default UserProfileEdit;
