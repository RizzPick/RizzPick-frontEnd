'use client'
import Image from 'next/image'
import React from 'react'
import useSWR from 'swr';
import { ChatData } from '@/types/chat';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import UserSkeleton from '../common/UserSkeleton';
import { AiOutlineClose } from "react-icons/ai"
import { BsFillSearchHeartFill } from "react-icons/bs"
import Home from "../../../public/profileIcon/Home.svg"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"

function ChatProfile() {
  const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
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
          <div className='flex flex-col items-center gap-4 mt-[31px]'>
            {chat && 
              <div>
                <p className='text-3xl font-semibold'>{chat.nickname},{chat.age}</p>
              </div>
            }
            <div className='mt-[33px] px-4 py-1 h-[142px] w-[300px] flex flex-col gap-3 bg-neutral-100 rounded-2xl justify-center'>
                    {!chat.location && !chat.education ? 
                        <p className="text-center">작성된 내용이 없습니다.</p> 
                        : 
                        <>
                            { chat.education ? <><div className='flex items-center gap-4'><EducationIcon/>{chat.education}</div><hr/></>: null }
                            { chat.location ? <div className='flex items-center gap-4'><Home/>{chat.location}</div> : null }
                        </>
                    }
            </div>
            <div className='flex items-center gap-4 mt-[15px]'>
              {chat.mbti && <div className='text-fuchsia-400 text-xl border border-fuchsia-400 rounded-2xl px-2 py-1'>#{chat.mbti}</div>}
              {chat.religion && <div className='border border-fuchsia-400 text-fuchsia-400 text-xl rounded-2xl px-2 py-1'>{chat.religion === "NONE" ? ("종교 없음"):(`#${chat.religion}`)}</div>}
            </div>
          </div>
            <div className='mx-auto flex justify-center items-center w-[207px] bg-rose-100 rounded-full h-[45px] mt-10 hover:scale-110 transition-all duration-200'>
              <button className='text-red-600 text-xl'>채팅방 나가기</button>
            </div>
       </>
      ) : (
        <><UserSkeleton/></>
      )}
    
</div>
  )
}

export default ChatProfile