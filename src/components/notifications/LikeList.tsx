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
import Link from 'next/link';

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
        <header className='relative text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide p-4 hidden sm:flex sm:justify-center'>
            <button className='absolute left-[15px]' onClick={()=>router.back()}><Back/></button>
            <h1>내가 받은 좋아요 ({liked.length})</h1>
        </header>
        <div className='h-full bg-profile-gradient p-4 sm:rounded-3xl'>
          <div className='bg-likelist-gradient rounded-3xl pt-[38px] w-[810px] flex flex-col mx-auto h-[100vh] sm:bg-none sm:w-full sm:pt-0'>
            <div className='relative h-[169px] w-[169px] mx-auto sm:h-[85px] sm:w-[85px] mb-[27px] flex flex-none'>
              {profile && <Image src={profile?.data.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full' />}
            </div>
            <p className='text-center text-white text-3xl font-semibold sm:hidden'>내가 받은 좋아요</p>
            <div className='bg-white rounded-3xl px-10 py-4 mt-[27px] overflow-y-auto scrollbar-hide h-full sm:hidden'>
              <div className='grid grid-cols-3 gap-4'>
                {liked.map((like) => {
                  return (
                    <Link key={like.userId} href={`/user/profile/${like.userId}`}>
                      <div className='sm:w-28 relative sm:h-36 w-[219px] h-[264px]'>
                        <Image src={like.profilePic.image} alt={`${like.userId}`} fill style={{objectFit:"cover"}} className='rounded-md shadow'/>
                        <div className='absolute bottom-0 text-white p-2 text-base bg-black bg-opacity-40 rounded-md w-full'>{like.nickname}</div>
                      </div>
                  </Link>
                  )
                })}
              </div>
            </div>
              <div className='sm:grid grid-cols-3 gap-4 hidden'>
                {liked.map((like) => {
                  return (
                    <Link key={like.userId} href={`/user/profile/${like.userId}`}>
                      <div className='sm:w-28 relative sm:h-36 w-[219px] h-[264px]'>
                        <Image src={like.profilePic.image} alt={`${like.userId}`} fill style={{objectFit:"cover"}} className='rounded-md shadow'/>
                        <div className='absolute bottom-0 text-white p-2 text-base bg-black bg-opacity-40 rounded-md w-full'>{like.nickname}</div>
                      </div>
                  </Link>
                  )
                })}
              </div>
          </div>
        </div>
    </div>
  )
}

export default LikeList