import Chat from '@/components/chat/Chat';
import ChatList from '@/components/chat/ChatList';
import ChatProfile from '@/components/chat/ChatProfile';

export default function ChatPage() {
    return (
        <div className="grid grid-cols-4 w-[100vw]">
            <ChatList />
            <Chat />
            <ChatProfile />
        </div>
    );
}