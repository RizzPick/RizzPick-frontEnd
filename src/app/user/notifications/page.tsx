import ChatList from '@/components/chat/ChatList'
import Footer from '@/components/common/Footer'
import LikeList from '@/components/notifications/LikeList'
import React from 'react'

function notificationsPage() {
  return (
    <div>
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4 '>
            <h1>알림</h1>
        </header>
        <LikeList />
        <h2 className='text-zinc-800 text-xl font-semibold leading-tight tracking-wide px-5 py-2.5 border-b-black border-b'>메시지</h2>
        <ChatList />
        <Footer />
    </div>
  )
}

export default notificationsPage