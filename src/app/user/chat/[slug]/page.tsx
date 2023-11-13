'use client'
import ChatRoom from '@/components/chat/ChatRoom';
import Loader from '@/components/common/Loader';
import ChatAPI from '@/features/chat';
import { ChatData } from '@/types/chat';
import React, { useEffect, useState } from 'react'

function ChatRoomPage({params} : {params : { slug : number }}) {
  const chatRoomId = params.slug
  const [chat, setChat] = useState<ChatData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    const getChatRooms = async() => {
        try {
            const response = await ChatAPI.getChat(chatRoomId);
            console.log(response);
            if(response.status === 200) {
                setChat(response.data);
            }   
        } catch (error) {
        console.log(error);
        } finally {
        setIsLoading(false);
        }
    }
    getChatRooms();
},[chatRoomId])

  if(isLoading) return <Loader />

  return (
        <div className='w-full height-screen-vh'>
            <ChatRoom />
        </div>
  )
}
export default ChatRoomPage