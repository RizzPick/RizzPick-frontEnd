import Header from '@/components/header/Header';
import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';
import {cookies} from 'next/headers';
import axios from 'axios';

export default async function ChatPage() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('Authorization');
    const token = accessToken?.value;
    const response = await axios.get(`${process.env.SERVER_URL}/chat/rooms/me`, {
        headers : {
            "Authorization" : token
        }
    })
    const chats = response.data;
    /* Fetch 를 사용한 Data Fetching */
    /* const response = await fetch(`${process.env.SERVER_URL}/chat/rooms/me`,
    { 
        method: "GET",
        headers: {
            "Authorization" : token
        },
        cache: 'force-cache'
     })
        .then((response) => {
        if (!response.ok) {
            throw new Error(
                `This is an HTTP error: The status is ${response.status}`
            );
        }
            return response.json();
        })
        .catch((err) => {
            console.log(err.message);
        }); */
        
    return (
        <>
            {/* 헤더 공통 레이아웃으로 변경 예정 */}
            <Header />
            <div className="flex flex-row h-screen w-[100vw] overflow-hidden">
            <ChatList chats={chats}/>
            <Chat />
            <ChatProfile />
            </div>
        </>
    );
}