'use client'
import ChatList from '@/components/chat/ChatList'
import Footer from '@/components/common/Footer'
import LikeComp from '@/components/notifications/LikeComp'
import { CHAT_KEY } from '@/hooks/useChat'
import { ChatData } from '@/types/chat'
import React from 'react'
import useSWR from 'swr'

function NotificationsPage() {
  const {data:chats} = useSWR<ChatData[]>(CHAT_KEY);

  if(!chats) return;
  return (
    <div className='height-screen-vh'>
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4 '>
            <h1>알림</h1>
        </header>
        <LikeComp />
        <h2 className='text-zinc-800 text-xl font-semibold leading-tight tracking-wide px-5 pb-2.5 border-b-black border-b'>메시지</h2>
        <ChatList chats={chats}/>
        <Footer />
    </div>
  )
}

export default NotificationsPage