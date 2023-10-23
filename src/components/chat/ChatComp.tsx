'use client'
import { ChatData } from '@/types/chat'
import Image from 'next/image';
import React from 'react'
import UseChat, { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';

type Props = {
    data : ChatData;
}

function ChatComp({data}:Props) {
    const { setCurrentChat } = UseChat();
    const { data: chatRoomId } = useSWR<number>(CURRENT_CHAT_KEY);

  return (
    <div className="flex flex-row items-center border-b-[1px] border-s-1-gray-400 h-[122px] mx-2 cursor-pointer my-2" onClick={()=>setCurrentChat(data)}>
            <div className="rounded-full overflow-hidden w-[95px] h-[95px] mr-4">
                <Image
                    src={data.image}
                    alt="Picture of the author"
                    width={100}
                    height={100}
                />
            </div>
            <div className='h-full mt-8'>
                <div className='flex justify-between'>
                    <div className='font-bold text-xl'>
                        {data.nickname}
                    </div>
                    {chatRoomId === data.chatRoomId ? (<div className='w-6 rounded-full bg-gray-300 h-6'/>) : (<></>)}
                </div>
                <p className="w-[180px] text-ellipsis overflow-hidden break-words line-clamp-2 text-md text-gray-600">
                    {data.latestMessage}
                </p>
            </div>
        </div>
  )
}

export default ChatComp