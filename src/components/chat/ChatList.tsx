'use client'
import React, { useEffect, useState } from 'react'
import ChatComp from './ChatComp';
import { ChatData } from '@/types/chat';
import ChatAPI from '@/features/chat';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';
import { SyncLoader } from 'react-spinners';

function ChatList() {
  const { initializeChats } = UseChat();
  const {data:chats} = useSWR<ChatData[]>(CHAT_KEY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    const getChatRooms = async() => {
        try {
            const response = await ChatAPI.getChats();
            if(response.status === 200) {
                initializeChats(response.data);
                setIsLoading(false);
            }   
        } catch (error) {
          setIsLoading(false);
          console.log(error);
        }
    }
    getChatRooms();
},[initializeChats])

  return (
    <div className="h-[100vh-100px] overflow-y-auto sm:h-[82vh] mt-[74px] border-t-[1px] mx-4 sm:mt-0 sm:border-none sm:mx-0">
    {chats?.length === 0 ? (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-neutral-700">메시지 없음</p>
      </div>
    ) : isLoading ? (
      <div className='flex items-center justify-center h-full'>
        <SyncLoader />
      </div>
    ) : (
      chats?.map((chat) => {
        return <ChatComp data={chat} key={chat.chatRoomId} />;
      })
    )}
  </div>
  )
}

export default ChatList