'use client'
import { MyProfileRes } from '@/types/profile'
import { useRouter } from 'next/navigation'
import React from 'react'
import Back from "../../../public/chatIcon/Button.svg"
import Image from 'next/image'
import LocationIcon from "../../../public/profileIcon/location.svg"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"

type Props = {
    profile : MyProfileRes
}

function OtherUserProfile({profile} : Props) {
    const router = useRouter();
  return (
    <div className='w-full h-[100vh]'>
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4'>
            <button className='absolute left-[15px]' onClick={()=>router.back()}><Back/></button>
            <h1>{profile.nickname}</h1>
        </header>
        <div className='relative w-[187px] h-[187px] mx-auto mt-[41px]'>
            <Image src={profile.profileImages[0].image} alt='프로필 이미지' fill className='rounded-full' style={{objectFit:"cover"}} priority />
        </div>
        <div className='flex items-center justify-center mt-[33px] text-zinc-800 text-2xl'>{profile.nickname}, {profile.age}</div>
        <div className='mt-[33px] p-6 bg-white h-[181px] w-full flex flex-col gap-3 border-b border-neutral-400 border-t'>
                {!profile.location && !profile.education && !profile.mbti && !profile.religion ? 
                    <p className="text-center">작성된 내용이 없습니다.</p> 
                    : 
                    <>
                        { profile.education ? <div className='flex items-center gap-2'><EducationIcon/>{profile.education}</div> : null }
                        { profile.location ? <div className='flex items-center gap-2'><LocationIcon/>{profile.location}</div> : null }
                        <div className='flex items-center gap-4'>
                        { profile.mbti ? <div className='px-3 py-1 border-[#d67dff] border-2 rounded-3xl'>{profile.mbti}</div> : null }
                        { profile.religion ? <div className='px-3 py-1 border-[#d67dff] border-2 rounded-3xl'>{profile.religion}</div> : null }
                        </div>
                    </>
                }
        </div>
    </div>
  )
}

export default OtherUserProfile