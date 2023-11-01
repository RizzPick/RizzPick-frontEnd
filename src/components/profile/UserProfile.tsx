'use client'
import Image from 'next/image';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"
import { MyProfileRes } from '@/types/profile';
import Home from "../../../public/profileIcon/Home.svg"
import { eraseCookie } from '@/utils/cookie';
import Link from 'next/link';


type Props = {
    profile : MyProfileRes
}
function UserProfile({profile} : Props) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const logout = () => {
        eraseCookie('Authorization');
        eraseCookie('Authorization_Refresh');
        eraseCookie('status');
        sessionStorage.clear();
        alert('로그아웃 처리되었습니다.');
        router.push('/');
    };

  const onClick = (event : any) => {
    event.stopPropagation();
    router.push('/profile/edit');
  }

  return (
    <div className='bg-profile-gradient h-[100vh] py-[67px]'>
        <div className='relative w-[169px] h-[169px] mx-auto'>
          <Image src={profile.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full'/>
        </div>
        <section className='flex items-start justify-center flex-row gap-9 mt-[67px]'>
          <article className='w-[424px] h-[428px]'>
            <div className='flex flex-col w-full items-center'>
                <div className='p-4 bg-white h-[200px] w-full rounded-2xl flex flex-col gap-3 justify-center'>
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
                  <Link href={'/profile/edit'} className='w-full'>
                      <button className='px-4 py-2 bg-[#D67dff] mt-4 w-full rounded-3xl text-white font-bold hover:bg-pink-300'>정보수정</button>
                  </Link>
                <div className='mt-4 w-full rounded-2xl bg-white p-6 h-20 flex flex-col items-start justify-center text-gray-400 gap-1'>
                    <p className='cursor-pointer' onClick={()=>router.push('/')}>비밀번호 변경</p>
                    <hr className='w-full'/>
                    <p onClick={()=>setShowLogoutModal(true)} className='cursor-pointer'>로그아웃</p>
                </div>

                {showLogoutModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        {/* 모달 외부 배경 (그레이 오버레이) */}
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
                <div className='mt-4 w-full rounded-2xl bg-white p-6 h-10 flex flex-col items-start justify-center text-[#cb17f9]'>
                    회원탈퇴
                </div>
              </div>
              </article>
              <article>
                <div className='grid grid-cols-3 gap-4'>
                    <div className='w-[183px] h-[221px] border bg-white'></div>
                    <div className='w-[183px] h-[221px] border bg-white'></div>
                    <div className='w-[183px] h-[221px] border bg-white'></div>
                    <div className='w-[183px] h-[221px] border bg-white'></div>
                    <div className='w-[183px] h-[221px] border bg-white'></div>
                    <div className='w-[183px] h-[221px] border bg-white'></div>
                </div>
              </article>
          </section>
  </div>
  )
}

export default UserProfile