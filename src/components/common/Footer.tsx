'use client'
import AuthAPI from '@/features/auth';
import UseProfile, { USER_INFO_KEY } from '@/hooks/useProfile';
import { UserInfo } from '@/types/user';
import { getCookie } from '@/utils/cookie';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'
import {AiOutlineHome, AiOutlineComment, AiOutlineBell} from "react-icons/ai"
import useSWR from 'swr';

function Footer() {

  const token = getCookie("Authorization");
  const { initializeUserInfo } = UseProfile();
  const { data: profile } = useSWR<UserInfo>(USER_INFO_KEY);

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
    <footer className='fixed bottom-0 left-0 w-full hidden sm:block bg-white'>
      <nav className='flex justify-around text-[50px] py-4 items-center'>
        <button><AiOutlineHome/></button>
        <button><AiOutlineComment/></button>
        <button><AiOutlineBell/></button>
        {profile ? (
          <Link href="/profile">
            <div className='w-[50px] h-[50px] rounded-full relative'>
            <Image
                className="rounded-full"
                src={profile.data.profileImages[0].image}
                alt="Picture of the author"
                fill
                style={{objectFit:"cover"}}
                priority
            />
            </div>
          </Link>
        ) : (
          <div className='animate-pulse w-[50px] h-[50px] rounded-full bg-gray-200' role='status'></div>
        )}
      </nav>
    </footer>
  );
}

export default Footer;
