import React from 'react'
import ChatComp from './ChatComp';
import { ChatData } from '@/types/chat';

type Props = {
  chats : ChatData[];
}
function ChatList({chats}:Props) {
  return (
    <div className=" flex flex-col w-[429px] overflow-y-auto">
      {chats && chats.map((chat)=>{
        return <ChatComp data={chat} key={chat.chatRoomId}/>
      })}
      {/* 매칭된 회원이 없을 경우 보여져야 할 컴포넌트 처리 필요 */}
    </div>
  )
}

export default ChatList