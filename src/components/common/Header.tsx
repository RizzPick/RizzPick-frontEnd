'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserInfo } from '@/types/user';
import { useEffect, useState } from 'react';
import AuthAPI from '@/features/auth';
import { getCookie } from '@/utils/cookie';
import Alarm from '@/components/alarm/Alarm';
import Logo from '../../../public/Logo_color.png';

export default function Header() {
    const [showOverlay, setShowOverlay] = useState(false);
    const [openChatModal, setOpenChatModal] = useState(false);
    const token = getCookie('Authorization');
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const Open = () => {
        setShowOverlay(true);
        setOpenChatModal(true);
    };

    const close = () => {
        setShowOverlay(false);
        setOpenChatModal(false);
    };

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const response = await AuthAPI.getUserInfo();
                    setUserInfo(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, [token]);

    return (
        <header className="flex justify-between item-center px-8 sm:px-4 py-4 border-b border-zinc-300 sm:border-none">
            <Link href="/user/match" onClick={()=>sessionStorage.setItem('selectedIcon', 'home')}>
                <div className='relative w-[95px] h-[40px]'>
                <Image
                    src={Logo}
                    priority
                    alt="로고"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                </div>
            </Link>
            <nav className="flex gap-12 items-center sm:hidden text-2xl">
                <Link href="/user/plan/board">데이트</Link>
                <span onClick={Open} className="cursor-pointer">
                    알림
                </span>
                {openChatModal && <Alarm close={close} />}
                {showOverlay && (
                    <div
                        className="block fixed top-0 left-1/2 transform -translate-x-1/2 h-full z-30 w-full bg-stone-300 bg-opacity-40"
                        onClick={close}
                    ></div>
                )}
                {/* 다른 페이지에서 넘어갈때 404 나와서 경로 수정 필요 */}
                {userInfo && (
                    <>
                        <Link href="/profile">
                            <div>
                                프로필
                            </div>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
