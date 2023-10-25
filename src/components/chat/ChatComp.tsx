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
    const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
    console.log(chat);

  return (
    <div className="flex flex-row items-center border-b-[1px] border-s-1-gray-400 h-[122px] mx-2 cursor-pointer my-2 relative" onClick={()=>setCurrentChat(data)}>
            <div className="rounded-full overflow-hidden h-[95px] mr-4">
                <Image
                    src={data.image}
                    alt="Picture of the author"
                    width={100}
                    height={100}
                />
            </div>
            <div className='h-full mt-8'>
                <div className='flex justify-between items-center'>
                    <div className='font-bold text-xl'>
                        {data.nickname}
                    </div>
                    {chat?.chatRoomId === data.chatRoomId ? (<div className='w-4 rounded-full bg-chat-selected h-4 absolute top-2 right-4'/>) : (<></>)}
                </div>
                <p className="w-[180px] text-ellipsis overflow-hidden break-words line-clamp-2 text-md text-gray-600">
                    {data.latestMessage}
                </p>
            </div>
        </div>
  )
}

export default ChatComp
