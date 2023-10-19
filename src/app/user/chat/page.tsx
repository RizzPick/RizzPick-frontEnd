import Header from '@/components/header/Header';
import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';


export default async function ChatPage() {
    return (
        <>
            <Header />
            <div className="flex flex-row h-screen w-[100vw] overflow-hidden">
            <ChatList />
            <Chat />
            <ChatProfile />
            </div>
        </>
    );
}
