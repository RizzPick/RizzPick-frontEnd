'use client'
import { MyProfileRes } from '@/types/profile'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"
import Home from "../../../public/profileIcon/Home.svg"
import Link from 'next/link';
import useSWR from 'swr';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import AuthAPI from '@/features/auth';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';

function UserProfileMobile() {
    const { data : profile } = useSWR<MyProfileRes>(PROFILE_KEY);
    const { initializeProfile } = UseProfile();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const {logout} = useAuth();

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

    if(!profile) return


  return (
    <div>
        <div className='h-[100vh] bg-profile-gradient rounded-3xl p-4 relative mt-20 w-full flex justify-center'>
            <div className='absolute -top-0 -mt-20'>
            {/* 유저 이미지 태그 */}
                <div className='relative h-[146px] w-[146px]'>
                    {profile && <Image src={profile?.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full' />}
                </div>
            </div>
        <div className='flex flex-col mt-16 w-full items-center'>
          <div className='text-zinc-800 text-2xl font-semibold'>{profile.nickname}, {profile.age}</div>
            <div className='p-4 bg-white h-[200px] w-full mt-10 rounded-2xl flex flex-col gap-3 justify-center'>
                {!profile.location && !profile.education && !profile.mbti && !profile.religion ? 
                    <p className="text-center">작성된 내용이 없습니다.</p> 
                    : 
                    <>
                        { profile.education ? <div className='flex items-center gap-4 border-b py-2'><EducationIcon/>{profile.education}</div> : null }
                        { profile.location ? <div className='flex items-center gap-4 border-b py-2'><Home/>{profile.location}</div> : null }
                        <div className='flex items-center gap-4'>
                        { profile.mbti ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{profile.mbti}</div> : null }
                        { profile.religion ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{profile.religion}</div> : null }
                        </div>
                    </>
                }
            </div>
            <Link href={'/profile/edit'}>
                <button className='mx-auto px-4 py-2 bg-[#D67dff] mt-4 w-20 rounded-3xl text-white font-bold hover:bg-pink-300'>수정</button>
            </Link>
            <div className='mt-4 w-full rounded-2xl bg-white p-6 h-20 flex flex-col items-start justify-center text-gray-400 gap-1'>
                <p className='cursor-pointer' onClick={()=>toast("구현예정입니ㄷr..", {icon : '🥹'})}>비밀번호 변경</p>
                <hr className='w-full'/>
                <p onClick={()=>setShowLogoutModal(true)} className='cursor-pointer'>로그아웃</p>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={() => setShowLogoutModal(false)}></div>
                    
                    {/* 모달 창 */}
                    <div className="bg-white p-2 rounded-xl shadow-lg w-64 z-10 h-32 flex flex-col items-center justify-center">
                        <div>로그아웃 할까요?</div>
                        <div className="flex justify-between mt-4 w-full px-6">
                            <button onClick={() => setShowLogoutModal(false)} className="mr-2 px-4 py-2 rounded">취소</button>
                            <button onClick={() => { logout(); setShowLogoutModal(false); }} className="px-4 py-2rounded-lg transition-all hover:scale-125">확인</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='mt-4 w-full rounded-2xl bg-white p-6 h-10 flex flex-col items-start justify-center text-[#cb17f9] cursor-pointer' onClick={()=>toast("구현예정입니ㄷr..", {icon : '🥹'})}>
                회원탈퇴
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserProfileMobile