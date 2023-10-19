'use client'
import { ChatData } from '@/types/chat'
import Image from 'next/image';
import React from 'react'
import profiledog from '../../../public/images/profiledog.jpeg';
import UseChat from '@/hooks/useChat';

type Props = {
    data : ChatData;
}

function ChatComp({data}:Props) {
    console.log(data);
    const { setCurrentChatRoom } = UseChat();

  return (
    <div className="flex flex-row items-center border-t-[1px] border-b-[1px] border-s-1-gray-400 h-[122px] my-20 mx-2 cursor-pointer" onClick={()=>setCurrentChatRoom(data.chatRoomId)}>
            <div className="rounded-full overflow-hidden w-[95px] h-[95px] mr-4">
                <Image
                    src={profiledog}
                    alt="Picture of the author"
                    objectFit="cover" // 이 부분은 이미지 비율을 유지하면서, 주어진 width/height 안에 이미지를 채워넣습니다.
                />
            </div>
            <div>
                <div>
                    <span>{data.nickname}</span>
                </div>
                <p className="w-[180px] text-ellipsis overflow-hidden break-words line-clamp-2 text-xs text-gray-600">
                    {data.latestMessage}
                </p>
            </div>
        </div>
  )
}

export default ChatComp