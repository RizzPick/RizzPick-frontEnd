'use client'
import React from 'react'
import ChatComp from './ChatComp';
import { ChatData } from '@/types/chat';
import { CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';

function ChatList() {
    const dummyData : ChatData[] = [
      {
        chatRoomId: 11111,
        image : "테스트이미지.jpg",
        nickname : "테스트닉네임",
        users : ['테스트유저'],
        latestMessage : "최근 메시지"
    },
      {
        chatRoomId: 22222,
        image : "테스트이미지2.jpg",
        nickname : "테스트닉네임2",
        users : ['테스트유저2'],
        latestMessage : "최근 메시지"
    }
  ]
  // API 로 불러온 데이터로 변경하는 작업 필요 🔥
  const { data : chats, isValidating } = useSWR<ChatData[]>(CHAT_KEY);
  console.log(chats);

  if(isValidating){
    return <div>Loading...</div>
  }
    
  return (
    <div className=" flex flex-col w-[429px] overflow-y-auto">
      {chats && chats.map((chat)=>{
        return <ChatComp data={chat} key={chat.chatRoomId}/>
      })}
        
    </div>
  )
}

export default ChatList