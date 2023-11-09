'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { MyProfileRes } from '@/types/profile';
import Link from 'next/link';
import useSWR from 'swr';
import UseProfile, { PROFILE_KEY } from '@/hooks/useProfile';
import AuthAPI from '@/features/auth';
import { useRouter } from 'next/navigation';
import { calculateAge } from '@/utils/dateUtils';
import LogoutModal from '../common/LogoutModal';
import ResignModal from '../common/ResignModal';

const EducationIcon = dynamic(() => import("../../../public/profileIcon/graduationcap.fill.svg"));
const HomeIcon = dynamic(() => import("../../../public/profileIcon/Home.svg"));

function UserProfile() {
    const { data : profile } = useSWR<MyProfileRes>(PROFILE_KEY);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showResignModal, setResignModal] = useState(false);
    const { initializeProfile } = UseProfile();
    const router = useRouter();

    useEffect(()=>{
        const fetchData = async() : Promise<void> => {
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
    <div className='bg-profile-gradient h-[100vh] py-[67px]'>
        <div className='relative w-[169px] h-[169px] mx-auto'>
          <Image src={profile.profileImages[0].image} alt='프로필 이미지' sizes="(max-width: 768px) 90vw, (max-width: 1200px) 30vw, 350px" fill={true} object-fit='cover' className='rounded-full' loading='lazy'/>
        </div>
        <div className='flex items-center justify-center mt-6 text-3xl'>
            {profile.nickname}, {calculateAge(profile.birthday)}
        </div>
        <div className='flex items-center justify-center mt-6 text-xl px-2 bg-white py-1 rounded-3xl max-w-[400px] mx-auto' style={{ whiteSpace: 'pre-wrap' }}>
            &quot;{profile.intro}&quot;
        </div>
        <section className='flex items-start justify-center flex-row gap-9 mt-[57px]'>
          <article className='w-[424px] h-[428px]'>
            <div className='flex flex-col w-full items-center'>
                <div className='p-4 bg-white h-[200px] w-full rounded-2xl flex flex-col gap-3 justify-center'>
                    {!profile.location && !profile.education && !profile.mbti && !profile.religion ? 
                        <p className="text-center">작성된 내용이 없습니다.</p> 
                        : 
                        <>
                            { profile.education ? <div className='flex items-center gap-4 border-b py-2'><EducationIcon/>{profile.education}</div> : null }
                            { profile.location ? <div className='flex items-center gap-4 border-b py-2'><HomeIcon/>{profile.location}</div> : null }
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
                    <p className='cursor-pointer' onClick={()=> router.push("profile/viewChangePasswd")}>비밀번호 변경</p>
                    <hr className='w-full'/>
                    <p onClick={()=>setShowLogoutModal(true)} className='cursor-pointer'>로그아웃</p>
                </div>

                {showLogoutModal && <LogoutModal setShowLogoutModal={setShowLogoutModal}/>}
                <div className='mt-4 w-full rounded-2xl bg-white p-6 h-10 flex flex-col items-start justify-center text-[#cb17f9] cursor-pointer' onClick={()=>setResignModal(true)}>
                    회원탈퇴
                </div>
                {showResignModal && <ResignModal setResignModal={setResignModal} profile={profile}/>}
              </div>
              </article>
              <article id='images'>
                  <div className='grid grid-cols-3 gap-4'>
                      {Array(6).fill(null).map((_, idx) => (
                          <div key={idx} className='w-[183px] h-[221px] border bg-white relative'>
                              {profile.profileImages && profile.profileImages[idx] ? (
                                  <Image
                                      src={profile.profileImages[idx].image}
                                      alt={`Profile Image ${idx + 1}`}
                                      loading="lazy"
                                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 30vw, 350px"
                                      fill={true}
                                      object-fit="cover"
                                  />
                              ) : (
                                  <div className="absolute inset-0 bg-white flex items-center justify-center">
                                      <span></span>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </article>
          </section>
  </div>
  )
}

export default UserProfile