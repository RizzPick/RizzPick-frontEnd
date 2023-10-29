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
        <Footer />
    </div>
  )
}

export default notificationsPage