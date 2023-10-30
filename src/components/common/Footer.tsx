'use client'
import AuthAPI from '@/features/auth';
import UseProfile, { USER_INFO_KEY } from '@/hooks/useProfile';
import { UserInfo } from '@/types/user';
import { getCookie } from '@/utils/cookie';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

// ICON
import Bell from "../../../public/footerIcon/bell.fill.svg"
import BellSel from "../../../public/footerIcon/bell.fill.sel.svg"
import Home from "../../../public/footerIcon/Union.svg"
import HomeSel from "../../../public/footerIcon/Home.sel.svg"
import Chat from "../../../public/footerIcon/Vector.svg"
import ChatSel from "../../../public/footerIcon/Vector.sel.svg"
import List from "../../../public/footerIcon/list.bullet.svg"
import ListSel from "../../../public/footerIcon/list.bullet.sel.svg"
import { useRouter } from 'next/navigation';

function Footer() {

  const token = getCookie("Authorization");
  const { initializeUserInfo } = UseProfile();
  const { data: profile } = useSWR<UserInfo>(USER_INFO_KEY);
  const router = useRouter();

  const [selectedIcon, setSelectedIcon] = useState<string>('home');
  const handleIconClick = (iconName:string) => {
    sessionStorage.setItem('selectedIcon', iconName);
    setSelectedIcon(iconName);
    switch(iconName) {
      case 'home':
        router.push('/user/match');
        break;
      case 'chat':
        router.push('/user/chat');
        break;
      case 'bell':
        router.push('/user/notifications');
        break;
      case 'board':
        router.push('/user/plan/board');
        break;
      default:
        break;
    }
  }

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

  useEffect(() => {
    const storedIcon = sessionStorage.getItem('selectedIcon');
    if (storedIcon) {
      setSelectedIcon(storedIcon);
    }
  }, []);


  return (
    <footer className='fixed bottom-0 left-0 w-full hidden sm:block bg-white border-t-gray-400 rounded-t-3xl shadow-custom'>
      <nav className='flex justify-around text-[50px] py-4 items-center'>
      <button onClick={() => handleIconClick('board')}>
          {selectedIcon === 'board' ? <ListSel /> : <List />}
        </button>
      <button onClick={() => handleIconClick('bell')}>
          {selectedIcon === 'bell' ? <BellSel /> : <Bell />}
        </button>
        <button onClick={() => handleIconClick('home')}>
          {selectedIcon === 'home' ? <HomeSel /> : <Home />}
        </button>
        
        <button onClick={() => handleIconClick('chat')}>
          {selectedIcon === 'chat' ? <ChatSel /> : <Chat />}
        </button>
        {profile ? (
          <Link href="/profile" onClick={() => handleIconClick('profile')}>
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
