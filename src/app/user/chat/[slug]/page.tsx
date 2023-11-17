'use client'
import ChatRoom from '@/components/chat/ChatRoom';
import Loader from '@/components/common/Loader';
import ChatAPI from '@/features/chat';
import UseChat, { CHAT_MESSAGE_KEY } from '@/hooks/useChat';
import { ChatDetail } from '@/types/chat';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

function ChatRoomPage({params} : {params : { slug : number }}) {
  const chatRoomId = params.slug
  const [isLoading, setIsLoading] = useState(true);
  const {data: chat} = useSWR<ChatDetail>(CHAT_MESSAGE_KEY);
  const { initializeChat } = UseChat();

  useEffect(()=>{
    const getChatRooms = async() => {
        try {
            const response = await ChatAPI.getChat(chatRoomId);
            if(response.status === 200) {
                initializeChat(response.data);
            }   
        } catch (error) {
            console.log(error);
        } finally {
        setIsLoading(false);
        }
    }
    getChatRooms();
},[chatRoomId, initializeChat])

  if(isLoading) return <Loader />

  return (
        <div className='w-full height-screen-vh'>
            <ChatRoom chat={chat} chatRoomId={chatRoomId}/>
        </div>
  )
}
export default ChatRoomPage