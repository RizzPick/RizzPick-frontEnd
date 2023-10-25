'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserInfo } from '@/types/user';
import { useEffect, useState } from 'react';
import AuthAPI from '@/features/auth';
import { getCookie } from '@/utils/cookie';
import profiledog  from '../../../public/images/profiledog.jpeg'
import Alarm from '@/components/alarm/Alarm';

export default function Header() {
    const [showOverlay, setShowOverlay] = useState(false);
    const [openChatModal, setOpenChatModal] = useState(false);
    const token = getCookie("Authorization");
    const [userInfo, setUserInfo] = useState<UserInfo>();

    const Open = () => {
        setShowOverlay(true);
        setOpenChatModal(true);
    };

    const close = () => {   
        setShowOverlay(false);
        setOpenChatModal(false);
    };

    useEffect(()=>{
        if(token){
            const fetchData = async() => {
                try {
                    const response = await AuthAPI.getUserInfo();
                    setUserInfo(response.data);
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            } 
            fetchData();
        }
    },[token])


    // 로딩 과정 중 보여질 이미지 처리
    return (
        <header className="flex justify-between item-center p-4 border-b-2 border-s-1-white-100">
            <Link href="/user/match">
                <h2 className="text-3xl font-bold">Will you</h2>
            </Link>
            <nav className="flex gap-4 items-center">
                <Link href="/user/plan/board">게시판</Link>
                {openChatModal && <Alarm close={close} />}

                {showOverlay && (
                    <div
                        className="block fixed top-0 left-1/2 transform -translate-x-1/2 h-full bg-black bg-opacity-50 z-30 w-full"
                        onClick={close}
                    ></div>
                )}
                <span onClick={Open} className="cursor-pointer">
                    알림
                </span>

                {/* 다른 페이지에서 넘어갈때 404 나와서 경로 수정 필요 */}
                {userInfo && 
                <Link href="/profile">
                    <Image
                        className="rounded-full mx-auto"
                        src={userInfo.data.profileImages[0].image}
                        alt="Picture of the author"
                        width={30}
                        height={30}
                        priority
                    />
                </Link>
                }
                {!userInfo && 
                <Link href="/profile">
                <Image
                    className="rounded-full mx-auto"
                    src={profiledog}
                    placeholder='blur'
                    blurDataURL='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII='
                    alt="Picture of the author"
                    width={30}
                    height={30}
                />
            </Link>}
            </nav>
        </header>
    );
}
