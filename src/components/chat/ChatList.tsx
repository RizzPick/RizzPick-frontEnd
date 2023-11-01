'use client'
import React, { useEffect } from 'react'
import ChatComp from './ChatComp';
import { ChatData } from '@/types/chat';
import ChatAPI from '@/features/chat';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';

function ChatList() {
  const { initializeChats } = UseChat();
  const {data:chats} = useSWR<ChatData[]>(CHAT_KEY);
  console.log(chats);

  useEffect(()=>{
    const getChatRooms = async() => {
        try {
            const response = await ChatAPI.getChats();
            if(response.status === 200) {
                initializeChats(response.data);
            }   
        } catch (error) {
          console.log(error);
        }
    }
    getChatRooms();
},[initializeChats])

  return (
    <div className="h-[100vh-100px] overflow-y-auto sm:h-[82vh] mt-[74px] border-t-[1px] mx-4">
      {chats && chats.map((chat)=>{
        return <ChatComp data={chat} key={chat.chatRoomId}/>
      })}
    </div>
  )
}

export default ChatList