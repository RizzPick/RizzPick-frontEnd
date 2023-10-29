import ChatRoom from '@/components/chat/ChatRoom';
import axios from 'axios';
import React from 'react'


type Props = {
    params: {
        slug: string;
    };
};

async function ChatRoomPage({ params: { slug } }: Props) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/message/${slug}`)
    const chat = response.data.data;
    console.log(chat);
  return (
    <div>
        <ChatRoom chat={chat} chatRoomId={slug}/>
    </div>
  )
}
export default ChatRoomPage