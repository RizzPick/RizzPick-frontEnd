'use client';
import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';
import Back from '../../../../public/chatIcon/Button.svg';
import { useRouter } from 'next/navigation';
import Footer from '@/components/common/Footer';
import UseChat, { CHAT_KEY, CURRENT_CHAT_KEY } from '@/hooks/useChat';
import { ChatData } from '@/types/chat';
import useSWR from 'swr';
import UserLayout from '../layout';
import { useEffect, useState } from 'react';
import ChatAPI from '@/features/chat';
import Loader from '@/components/common/Loader';
import { useMediaQuery } from 'react-responsive';

export default function ChatPage() {
    const router = useRouter();
    const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
    const { data: chats } = useSWR<ChatData[]>(CHAT_KEY);
    const [isLoading, setIsLoading] = useState(true);
    const { initializeChats } = UseChat();
    const [mobile, setMobile] = useState(false);
    const isMobile = useMediaQuery({
        query: '(max-width:480px)',
    });

    useEffect(() => {
        setMobile(isMobile);
    }, [isMobile]);


    useEffect(()=>{
        const getChatRooms = async() => {
            try {
                const response = await ChatAPI.getChats();
                if(response.status === 200) {
                    initializeChats(response.data);
                }   
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        getChatRooms();
    },[initializeChats])

    if(!chats) return;
    if(isLoading) return <Loader />

    return (
        <div className='font-sans'>
            {mobile && 
                <div>
                    <div className="grid grid-cols-1 w-full height-screen-vh">
                        <header className="text-center text-neutral-700 text-xl flex justify-center p-4 border-b-1 border">
                            <button
                                className="absolute left-[15px]"
                                onClick={() => router.back()}
                            >
                                <Back />
                            </button>
                            <h1>메시지</h1>
                        </header>
                        <ChatList chats={chats} />
                        <Footer />
                    </div>
                </div>
            }
            {!mobile && 
                <div>
                    <UserLayout showHeader={true}>
                    <div>
                        <div className="grid grid-cols-4">
                            <ChatList chats={chats}/>
                            {chat == undefined || chat == null ? (
                                <div
                                    className="col-span-3 bg-profile-edit-gradient"
                                    style={{ height: `calc(100vh - 73px)` }}
                                />
                            ) : (
                                <>
                                    <div className="col-span-2 border-l-2 border-r-2">
                                        <Chat chatRoomId={chat.chatRoomId}/>
                                    </div>
                                    <ChatProfile />
                                </>
                            )}
                        </div>
                    </div>
                </UserLayout>
                </div>
            }
        </div>
    );
}
