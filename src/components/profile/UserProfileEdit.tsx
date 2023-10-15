import ProfileAPI from '@/features/profile';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { Mbti, MyProfileRes, ProfileForm, Religion } from '@/types/profile';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

function UserProfileEdit() {
  const { data : profile,isValidating } = useSWR<MyProfileRes>(PROFILE_KEY);
  const { setCurrentProfile } = UseProfile();
  const { register, handleSubmit, setValue, formState: {errors} } = useForm<ProfileForm>();

  useEffect(() => {
    const profileFormKeys: (keyof ProfileForm)[] = [
        'nickname',
        'age',
        'education',
        'userActiveStatus',
        'gender',
        'location',
        'mbti',
        'religion',
      ];
    if (profile) {
      for (const key of profileFormKeys) {
        if (profile[key] !== undefined) {
          setValue(key, profile[key]);
        }
      }
    }
  }, [profile, setValue]);

  const onSubmit = async(data: ProfileForm) => {
    // 프로필 등록 로직 (API 호출 등)
    try {
      const response = await ProfileAPI.updateProfile(data);
      if(response.status === 200) {
        setCurrentProfile(response.data.data);
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
    <section className='w-full'>
      <h2 className="text-2xl mb-6">프로필 수정</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">닉네임</label>
          {errors.nickname && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <input {...register("nickname", {required : true})} className="w-full p-2 border rounded" placeholder="닉네임을 입력하세요" />
          
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">성별</label>
          {errors.gender && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <select {...register("gender", {required :true})} className="w-full p-2 border rounded" >
            <option value="">성별을 선택하세요</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="TRANSGENDER">트랜스젠더</option>
          </select>
          <div className='flex justify-between'>
          <label className="block text-gray-700 mb-2">나이</label>
          {errors.age && <p className="text-red-500">필수값입니다.</p>}
          </div>
          <select {...register("age", {required:true})} className="w-full p-2 border rounded">
            <option value="">나이를 선택하세요</option>
            {/* 예시로 18~30세까지 옵션 추가 (필요에 따라 수정) */}
            {Array.from({ length: 13 }, (_, i) => i + 18).map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>

          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
          <label className="block text-gray-700 mb-2">학교</label>
          <input {...register("education")} className="w-full p-2 border rounded" placeholder="학교를 입력하세요" />


          <label className="block text-gray-700 mb-2">지역</label>
          <select {...register("location")} className="w-full p-2 border rounded">
            <option value="NONE">지역을 선택하세요</option>
            <option value="SEOUL">서울</option>
            <option value="BUSAN">부산</option>
            <option value="INCHEON">인천</option>
            <option value="DAEGU">대구</option>
            <option value="DAEJEON">대전</option>
            <option value="GWANGJU">광주</option>
            <option value="ULSAN">울산</option>
          </select>

          <label className="block text-gray-700 mb-2">MBTI</label>
          <select {...register("mbti")} className="w-full p-2 border rounded">
            {Object.values(Mbti).map((mbtiValue) => (
              <option key={mbtiValue} value={mbtiValue}>
                {mbtiValue === "NONE" ? "MBTI를 선택하세요" : mbtiValue}
              </option>
            ))}
          </select>

          <label className="block text-gray-700 mb-2">종교</label>
          <select {...register("religion")} className="w-full p-2 border rounded" >
            <option value="NONE">종교를 선택하세요</option>
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
      </section>
  )
}

export default UserProfileEdit