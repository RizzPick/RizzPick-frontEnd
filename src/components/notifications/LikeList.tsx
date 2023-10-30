'use client'
import { LikeData } from '@/types/like'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Back from "../../../public/chatIcon/Button.svg"
import Image from 'next/image';
import useSWR from 'swr';
import UseProfile, { USER_INFO_KEY } from '@/hooks/useProfile';
import { UserInfo } from '@/types/user';
import { getCookie } from '@/utils/cookie';
import AuthAPI from '@/features/auth';

type Props = {
    liked : LikeData[];
}

function LikeList({liked} : Props) {
  const { data: profile } = useSWR<UserInfo>(USER_INFO_KEY);
    const router = useRouter();
    const token = getCookie("Authorization");
    const {initializeUserInfo} = UseProfile();

    useEffect(()=>{
      if(token){
          const fetchData = async() => {
              try {
                  const response = await AuthAPI.getUserInfo();
                  initializeUserInfo(response.data);
              } catch (error) {
                  console.log(error);
              }
          } 
          fetchData();
      }
  },[initializeUserInfo, token])
    
  return (
    <div>
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4'>
            <button className='absolute left-[15px]' onClick={()=>router.back()}><Back/></button>
            <h1>내가 받은 좋아요 ({liked.length})</h1>
        </header>
        <div className='h-[100vh] bg-custom-gradient rounded-3xl p-4'>
          <div className='relative h-[85px] w-[85px] mx-auto'>
            {profile && <Image src={profile?.data.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full' />}
          </div>
          <div className='grid grid-cols-3 gap-3 mt-7'>
            {liked.map((like) => {
              return (
              <div key={like.userId} className='w-28 relative h-36'>
                <Image src={like.profilePic.image} alt={`${like.userId}`} fill style={{objectFit:"cover"}} className='rounded-md shadow'/>
                <div className='absolute bottom-0 text-white p-2 text-base bg-black bg-opacity-40 rounded-md w-full'>{like.nickname}</div>
              </div>
              )
            })}
          </div>
        </div>
    </div>
  )
}

export default LikeList