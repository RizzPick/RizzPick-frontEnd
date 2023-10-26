'use client'
import React, { useEffect } from 'react'
import ChatComp from './ChatComp';
import { ChatData } from '@/types/chat';
import ChatAPI from '@/features/chat';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';

function ChatList() {
  const { initializeChats,setCurrentChat } = UseChat();
  const {data:chats} = useSWR<ChatData[]>(CHAT_KEY);

  useEffect(()=>{
    const getChatRooms = async() => {
        try {
            const response = await ChatAPI.getChats();
            if(response.status === 200) {
                initializeChats(response.data);
                setCurrentChat(response.data[0]);
            }   
        } catch (error) {
          console.log(error);
        }
    }
    getChatRooms();
},[initializeChats, setCurrentChat])

  return (
    <div className="h-[800px] overflow-y-auto">
      {chats && chats.map((chat)=>{
        return <ChatComp data={chat} key={chat.chatRoomId}/>
      })}
    </div>
  )
}

export default ChatList