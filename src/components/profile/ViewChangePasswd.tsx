'use client'
import AuthAPI from '@/features/auth';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import { MyProfileRes } from '@/types/profile';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

type ChangePasswd = {
    currentPwd : string;
    newPwd : string;
    newPwd_confirm : string;
}

function ViewChangePasswd() {
    const {
        watch,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ChangePasswd>();
    const { data : profile } = useSWR<MyProfileRes>(PROFILE_KEY);
    const router = useRouter();
    const { initializeProfile } = UseProfile();
    useEffect(()=>{
        const fetchData = async() => {
            try {
                const response = await AuthAPI.getUserInfo();
                initializeProfile(response.data.data);
            } catch (error) {
                console.log(error);
            }
        } 
        fetchData();
    },[initializeProfile])

    const onSubmit = async (data:ChangePasswd) => {
        const { newPwd_confirm, ...formData } = data;
        try{
            const res = await AuthAPI.changePassword(formData);
              if(res.status === 201){
                router.push('/profile');
                toast.success(res.data.message);
              }
            } catch (error) {
                console.log(error);
                toast.error('비밀번호가 올바르지 않습니다')
            }
        };

    function renderPasswordErrorMessages(error: any) {
        switch (error.type) {
          case 'pattern':
            return <p className="text-red-500 text-[10px]">✱ 알파벳 대소문자, 숫자, 특수문자를 포함해야 합니다.</p>;
          case 'minLength':
            return <p className="text-red-500 text-[10px]">✱ 비밀번호는 최소 6자리 이상이어야 합니다.</p>;
          default:
            return null;
        }
      }


    if(!profile) return
  return (
    <div className='bg-profile-gradient h-[100vh] py-[67px] sm:rounded-3xl sm:py-6'>
        <div className='relative w-[169px] h-[169px] mx-auto sm:hidden'>
          <Image src={profile.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full'/>
        </div>
        <div className='flex items-center justify-center mt-6 text-2xl font-semibold sm:mt-0'>
            비밀번호 변경
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center mt-[57px] sm:mt-8'>
          <article className='w-[660px] h-[50vh] bg-white rounded-3xl p-10 flex flex-col sm:bg-profile-gradient'>
            <label className='font-bold text-neutral-600 mb-4'>현재 비밀번호</label>
            <input
                id='currentPwd'
                className="border rounded-3xl py-2 px-3 w-full text-sm"
                placeholder='현재 비밀번호를 입력해주세요'
                required
                {...register("currentPwd", {
                    required: true,
                    minLength: 6,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/,
                })}
                />
            <div className='flex justify-between items-center'>
            <label className='font-bold text-neutral-600 mt-10 mb-4'>새 비밀번호</label> 
            {errors.newPwd && renderPasswordErrorMessages(errors.newPwd)}
            </div>
            <input
                id='newPwd'
                className="border rounded-3xl py-2 px-3 w-full text-sm mb-4"
                placeholder='영어 대소문자,숫자,특수문자 포함 6자 이상'
                required
                {...register("newPwd", {
                    required: true,
                    minLength: 6,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/,
                })}
                />

                <input
                id='newPwd_confirm'
                className="border rounded-3xl py-2 px-3 w-full text-sm"
                placeholder='비밀번호를 한번 더 입력해주세요'
                required
                {...register("newPwd_confirm", {
                    required: true,
                    validate: (value) => value === watch('newPwd'),
                })}
                />
                {errors.newPwd_confirm && <p className="text-red-500 text-[10px]">✱ 비밀번호가 일치하지 않습니다.</p>}
                <div className='flex justify-center gap-4 sm:justify-end'>
                    <button type='button' className="bg-fuchsia-400 text-white px-2 py-1 w-28 font-semibold text-lg rounded-3xl mt-8" onClick={()=>router.push("/profile")}>취소</button>
                    <button className="bg-fuchsia-400 text-white px-2 py-1 w-28 font-semibold text-lg rounded-3xl mt-8">완료</button>
                </div>
            </article>
        </form>
  </div>
  )
}

export default ViewChangePasswd