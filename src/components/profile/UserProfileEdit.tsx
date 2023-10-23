import ProfileAPI from '@/features/profile';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes, ProfileForm } from '@/types/profile';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

function UserProfileEdit() {
  const { data : profile,isValidating } = useSWR<MyProfileRes>(PROFILE_KEY);
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
    // 프로필 등록 로직 (API 호출 등)
    try {
      const response = await ProfileAPI.updateProfile(data);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
        setLocalProfile(response.data.data);
        alert('프로필 등록이 완료되었습니다!');
        router
      }
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  };

  if (isValidating) {
    return <div>Loading...</div>;
  }

  return (
    <section className='w-full p-8'>
      <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">닉네임</label>
          {errors.nickname && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <input {...register("nickname", {required : true})} className="w-full p-3 border rounded-3xl" placeholder="닉네임을 입력하세요" />
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">성별</label>
          {errors.gender && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <select {...register("gender", {required :true})} className="w-full p-3 border rounded-3xl" >
            <option value="">성별을 선택하세요</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="TRANSGENDER">트랜스젠더</option>
          </select>
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">나이</label>
          {errors.age && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <select {...register("age", {required:true})} className="w-full p-3 border rounded-3xl">
            <option value="">나이를 선택하세요</option>
            {/* 예시로 18~30세까지 옵션 추가 (필요에 따라 수정) */}
            {Array.from({ length: 13 }, (_, i) => i + 18).map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">소개</label>
          </div>
          <input {...register("intro")} className="w-full p-3 border rounded-3xl" placeholder="소개" />
          
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4">선택 사항</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <label className="block text-gray-700 mb-2">학교</label>
          <input {...register("education")} className="w-full p-3 border rounded-3xl" placeholder="학교를 입력하세요" />


          <label className="block text-gray-700 mb-2">지역</label>
          <select {...register("location")} className="w-full p-3 border rounded-3xl">
            <option value="">지역을 선택하세요</option>
            <option value="SEOUL">서울</option>
            <option value="BUSAN">부산</option>
            <option value="INCHEON">인천</option>
            <option value="DAEGU">대구</option>
            <option value="DAEJEON">대전</option>
            <option value="GWANGJU">광주</option>
            <option value="ULSAN">울산</option>
          </select>

          <label className="block text-gray-700 mb-2">MBTI</label>
          <select {...register("mbti")} className="w-full p-3 border rounded-3xl">
          <option value="">MBTI를 선택하세요</option>
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

          <label className="block text-gray-700 mb-2">종교</label>
          <select {...register("religion")} className="w-full p-3 border rounded-3xl" >
            <option value="">종교를 선택하세요</option>
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
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200">제출하기</button>
      </form>
      </div>
      </section>
  )
}

export default UserProfileEdit