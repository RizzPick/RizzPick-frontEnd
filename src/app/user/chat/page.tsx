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
    console.log(chats)
    return (
        <div className="grid grid-cols-4 w-[100vw]">
            <ChatList chats={chats}/>
            <Chat />
            <ChatProfile />
        </div>
    );
}