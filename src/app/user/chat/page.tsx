'use client'
import Header from '@/components/header/Header';
import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';
import ChatAPI from '@/features/chat';
import UseChat from '@/hooks/useChat';
import { useEffect } from 'react';


export default function ChatPage() {
    const { initializeChats } = UseChat();
    useEffect(()=>{
        const getChats = async() => {
            try {
                const response = await ChatAPI.getChats();
                console.log(response);
                if(response.status === 200){
                    initializeChats(response.data);
                }
            } catch(error) {
                console.log(error);
            }
        }
        getChats();
    },[initializeChats])

    return (
        <>
            {/* 헤더 공통 레이아웃으로 변경 예정 */}
            <Header />
            <div className="flex flex-row h-screen w-[100vw] overflow-hidden">
            <ChatList />
            <Chat />
            <ChatProfile />
            </div>
        </>
    );
}