import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';
import {cookies} from 'next/headers';
import axios from 'axios';

export default async function ChatPage() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('Authorization');
    const token = accessToken?.value;
    // const response = await axios.get(`${process.env.SERVER_URL}/chat/rooms/me`, {
    //     headers : {
    //         "Authorization" : token
    //     }
    // })

    if(!token) return;
    const chats = await fetch(`${process.env.SERVER_URL}/chat/rooms/me`,{ 
        cache : "no-cache",
        headers : {
            "Authorization" : token
        }})
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
    });
    console.log(chats);
    return (
        <div className="grid grid-cols-4 w-[100vw]">
            <ChatList chats={chats}/>
            <Chat />
            <ChatProfile />
        </div>
    );
}