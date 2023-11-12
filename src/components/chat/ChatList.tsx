'use client'
import React from 'react'
import ChatComp from './ChatComp';
import { ChatData } from '@/types/chat';

type Props = {
  chats : ChatData[]
}

function ChatList({chats} : Props) {

  return (
    <div className="h-[100vh-100px] overflow-y-auto sm:h-[82vh] mt-[74px] border-t-[1px] mx-4 sm:mt-0 sm:border-none sm:mx-0">
    {chats?.length === 0 ? (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-neutral-700">메시지 없음</p>
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