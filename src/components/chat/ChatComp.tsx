'use client'
import { ChatData } from '@/types/chat'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import UseChat, { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';

type Props = {
    data : ChatData;
}

function ChatComp({data}:Props) {

    const [mobile, setMobile] = useState(false);
    const router = useRouter();
    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    });

    useEffect(() => {
        setMobile(isMobile)
    }, [isMobile])
    const { setCurrentChat } = UseChat();
    const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);

    const handleClick = () => {
        if (mobile) {
            router.push(`/user/chat/${data.chatRoomId}`);
            setCurrentChat(data);
        } else {
            setCurrentChat(data);
        }
    }

  return (
    <div className="flex flex-row items-center border-b-[1px] border-s-1-gray-400 h-[122px] mx-2 cursor-pointer my-2 relative" onClick={handleClick}>
            <div className="rounded-full overflow-hidden h-[91px] w-[91px] mr-4 relative">
                <Image
                    src={data.image}
                    alt="Picture of the author"
                    fill
                    style={{objectFit:'cover'}}
                    priority
                />
            </div>
            <div className='h-full flex flex-col items-start justify-center gap-2'>
                <div className='flex justify-between items-center'>
                    <div className='font-bold text-xl'>
                        {data.nickname}
                    </div>
                    {chat?.chatRoomId === data.chatRoomId ? (<div className='w-4 rounded-full bg-chat-selected h-4 absolute top-2 right-4 sm:hidden'/>) : (<></>)}
                </div>
                <p className="w-[180px] text-ellipsis overflow-hidden break-words line-clamp-2 text-md text-gray-600">
                    {data.latestMessage}
                </p>
            </div>
        </div>
  )
}

export default ChatComp
