'use client';
import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';
import { useMediaQuery } from 'react-responsive';
import Back from '../../../../public/chatIcon/Button.svg';
import { useRouter } from 'next/navigation';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import { ChatData } from '@/types/chat';
import useSWR from 'swr';

export default function ChatPage() {
    const router = useRouter();
    const isMobile = useMediaQuery({
        query: '(max-width:767px)',
    });
    const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);

    return (
        <div>
            {isMobile ? (
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
                    <ChatList />
                    <Footer />
                </div>
            ) : null}

            {!isMobile ? (
                <div>
                    <div className="grid grid-cols-4">
                        <ChatList />
                        {chat == undefined || chat == null ? (
                            <div
                                className="col-span-3 bg-profile-edit-gradient"
                                style={{ height: `calc(100vh - 73px)` }}
                            />
                        ) : (
                            <>
                                <div className="col-span-2 border-l-2 border-r-2">
                                    <Chat />
                                </div>
                                <ChatProfile />
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
