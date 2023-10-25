'use client'
import Image from 'next/image'
import React from 'react'
import useSWR from 'swr';
import { ChatData } from '@/types/chat';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import UserSkeleton from '../common/UserSkeleton';
import { AiOutlineClose } from "react-icons/ai"
import { BsFillSearchHeartFill } from "react-icons/bs"

function ChatProfile() {
  const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
  console.log(chat);
  return (
    <div className="w-full p-4">
      {chat ? (
        <>
          <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-5">
          <Image
              src={chat.image}
              alt="Picture of the author"
              width={231}
              height={231}
              priority
          />
          </div>
          <hr className='my-4' />
          <div className='flex flex-col items-center gap-4'>
            {chat && 
              <div className='flex items-center gap-2 justify-start'>
                <p className='text-2xl font-bold'>{chat.nickname}</p>
                <p className='text-lg font-bold text-gray-400'>{chat.age}</p>
                </div>
            }
            {chat.intro && <div>{chat.intro}</div>}
            <div className='flex items-center gap-4'>
              {chat.mbti && <div className='border-[#d67dff] border rounded-2xl px-2 py-1'>{chat.mbti}</div>}
              {chat.religion && <div className='border-[#d67dff] border rounded-2xl px-2 py-1'>{chat.religion === "NONE" ? ("종교 없음"):(chat.religion)}</div>}
            </div>
          </div>
            <hr className='my-4' />
            <div className='mx-auto flex justify-center items-center gap-10'>
              <button className='flex justify-center items-center border-exit-mark border-2 rounded-full w-20 h-20 text-exit-mark font-bold text-3xl'><AiOutlineClose/></button>
              <button className='flex justify-center items-center border-gradient-start border-2 rounded-full w-20 h-20 text-gradient-start font-bold text-3xl'><BsFillSearchHeartFill/></button>
            </div>
       </>
      ) : (
        <><UserSkeleton/></>
      )}
    
</div>
  )
}

export default ChatProfile