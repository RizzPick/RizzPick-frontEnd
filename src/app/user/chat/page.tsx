'use client'
import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Back from "../../../../public/chatIcon/Button.svg"
import { useRouter } from 'next/navigation';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

export default function ChatPage() {
    const router = useRouter();
    const [mobile, setMobile] = useState(false);
    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    });

    useEffect(() => {
        setMobile(isMobile)
    }, [isMobile])

    return (
        <div>
        {mobile ? (
            <div className='grid grid-cols-1 w-full height-screen-vh'>
                    <header className='text-center text-neutral-700 text-xl flex justify-center p-4 border-b-1 border'>
                        <button className='absolute left-[15px]' onClick={()=>router.back()}><Back/></button>
                        <h1>메시지</h1>
                    </header>
                <ChatList />
                <Footer />
            </div>
        ):(
            <div>
                <Header />
                <div className="grid grid-cols-4 w-[100vw]">
                    <ChatList />
                    <div className='col-span-2 border-l-2 border-r-2'>
                        <Chat />
                    </div>
                    <ChatProfile />
                </div>
            </div>
        )}
    </div>
    )
}