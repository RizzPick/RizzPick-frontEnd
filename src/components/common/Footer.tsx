'use client'
import React, { useEffect, useState } from 'react'

// ICON
import Bell from "../../../public/footerIcon/bell.fill.svg"
import BellSel from "../../../public/footerIcon/bell.fill.sel.svg"
import Home from "../../../public/footerIcon/Union.svg"
import HomeSel from "../../../public/footerIcon/Home.sel.svg"
import Chat from "../../../public/footerIcon/Vector.svg"
import ChatSel from "../../../public/footerIcon/Vector.sel.svg"
import List from "../../../public/footerIcon/list.bullet.svg"
import ListSel from "../../../public/footerIcon/list.bullet.sel.svg"
import User from "../../../public/footerIcon/User.svg"
import UserSel from "../../../public/footerIcon/UserSel.svg"
import { useRouter } from 'next/navigation';

function Footer() {

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
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const storedIcon = sessionStorage.getItem('selectedIcon');
    if (storedIcon) {
      setSelectedIcon(storedIcon);
    }
  }, []);


  return (
    <footer className='sticky bottom-0 left-0 w-full hidden sm:block bg-white border-t-gray-400 rounded-t-3xl shadow-custom'>
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
        <button onClick={() => handleIconClick('profile')}>
          {selectedIcon === 'profile' ? <UserSel /> : <User />}
        </button>
      </nav>
    </footer>
  );
}

export default Footer;
