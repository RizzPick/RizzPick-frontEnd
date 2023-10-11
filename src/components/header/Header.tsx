'use client';

import Link from 'next/link';
import Image from 'next/image';
import profile from '../../../public/images/profile.jpeg';
import { useState } from 'react';
// import Alarm from './Alarm';

export default function Header() {
    const [showOverlay, setShowOverlay] = useState(false);
    const [openChatModal, setOpenChatModal] = useState(false);

    const Open = () => {
        setShowOverlay(true);
        setOpenChatModal(true);
    };

    const close = () => {
        setShowOverlay(false);
        setOpenChatModal(false);
    };

    return (
        <header className="flex justify-between item-center p-4 border-b-2 border-s-1-white-100">
            <Link href="/">
                <h2 className="text-3xl font-bold">Will you</h2>
            </Link>
            <nav className="flex gap-4 items-center">
                <Link href="/noticeBoard">게시판</Link>
                {/* {openChatModal && <Alarm close={close} />} */}

                {showOverlay && (
                    // 오버레이 클릭 시 모달도 닫히도록 함
                    <div
                        className="block fixed top-0 left-1/2 transform -translate-x-1/2 h-full bg-black bg-opacity-50 z-30 w-full"
                        onClick={close}
                    ></div>
                )}
                <span onClick={Open} className="cursor-pointer">
                    알림
                </span>

                <Link href="/profile">
                    <Image
                        className="rounded-full mx-auto"
                        src={profile}
                        alt="Picture of the author"
                        width={30}
                        height={30}
                        priority
                    />
                </Link>
            </nav>
        </header>
    );
}
