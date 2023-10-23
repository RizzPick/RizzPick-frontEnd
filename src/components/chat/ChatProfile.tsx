'use client'
import Image from 'next/image'
import React from 'react'
import profiledog from '../../../public/images/profiledog.jpeg';
import useSWR from 'swr';
import { ChatData } from '@/types/chat';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import UserSkeleton from '../common/UserSkeleton';

function ChatProfile() {
  const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
  console.log(chat);
  return (
    <div className="w-full p-4">
      {chat ? (
        <>
        <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-5">
        <Image
            src={profiledog}
            alt="Picture of the author"
            width={231}
            height={231}
            priority
        />
        </div>
        <hr className='my-4' />
        <div className='flex flex-col items-center gap-4'>
          <div>현재 나와 채팅하는 사람의 정보 / 아래에 넣을 거임</div>
          <div>현재 나와 채팅하는 사람의 정보 / 아래에 넣을 거임</div>
          <div>현재 나와 채팅하는 사람의 정보 / 아래에 넣을 거임</div>
        </div>
    </>
      ) : (
        <><UserSkeleton/></>
      )}
    
</div>
  )
}

export default ChatProfile