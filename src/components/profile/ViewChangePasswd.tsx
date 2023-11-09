'use client'
import React, { useState, useEffect } from 'react';
import AuthAPI from '@/features/auth';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes } from '@/types/profile';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

function ViewChangePasswd() {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');
  const { data: profile } = useSWR<MyProfileRes>(PROFILE_KEY);
  const router = useRouter();
  const { initializeProfile } = UseProfile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthAPI.getUserInfo();
        initializeProfile(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [initializeProfile]);

  const onSubmit = async (e:any) => {
    e.preventDefault();
    if (newPwd !== newPwdConfirm) {
      toast.error('일치하지 않습니다!');
      return;
    }

    try {
      const verifyPassword = await AuthAPI.verifyPassword({ password: currentPwd });
      console.log(verifyPassword);
      if (verifyPassword.status === 200) {
        const res = await AuthAPI.changePassword({ newPassword : newPwd });
        if (res.status === 200) {
          router.push('/profile');
          toast.success(res.data.message);
        }
      } 
    } catch (error) {
      console.error(error);
      toast.error('비밀번호가 일치하지 않습니다');
    }
  };

  if (!profile) return null;

  return (
    <div className='bg-profile-gradient h-[100vh] py-[67px] sm:rounded-3xl sm:py-6'>
      <div className='relative w-[169px] h-[169px] mx-auto sm:hidden'>
          <Image src={profile.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full'/>
        </div>
        <div className='flex items-center justify-center mt-6 text-2xl font-semibold sm:mt-0'>
            비밀번호 변경
        </div>
      <form onSubmit={onSubmit} className='flex justify-center mt-[57px] sm:mt-8'>
      <article className='w-[660px] h-[50vh] bg-white rounded-3xl p-10 flex flex-col sm:bg-profile-gradient'>
            <label className='font-bold text-neutral-600 mb-4'>현재 비밀번호</label>
        <input
          className="border rounded-3xl py-2 px-3 w-full text-sm"
          placeholder='현재 비밀번호를 입력해주세요'
          value={currentPwd}
          onChange={(e) => setCurrentPwd(e.target.value)}
          required
          type='password'
        />
        <label className='font-bold text-neutral-600 mt-10 mb-4'>새 비밀번호</label> 
        <input
          type='password'
          className="border rounded-3xl py-2 px-3 w-full text-sm mb-4"
          placeholder='새 비밀번호'
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          required
        />
        <input
          type='password'
          className="border rounded-3xl py-2 px-3 w-full text-sm"
          placeholder='비밀번호를 한번 더 입력해주세요'
          value={newPwdConfirm}
          onChange={(e) => setNewPwdConfirm(e.target.value)}
          required
        />
        <div className='flex justify-center gap-4 sm:justify-end'>
            <button type='button' className="bg-fuchsia-400 text-white px-2 py-1 w-28 font-semibold text-lg rounded-3xl mt-8" onClick={()=>router.push("/profile")}>취소</button>
            <button type='submit' className="bg-fuchsia-400 text-white px-2 py-1 w-28 font-semibold text-lg rounded-3xl mt-8">완료</button>
        </div>
        </article>
      </form>
    </div>
  );
}

export default ViewChangePasswd;
