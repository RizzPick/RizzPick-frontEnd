import Header from '@/components/header/Header';
import Chat from '@/components/chat/Chat';
import ChatPage from '@/components/chat/ChatRoom';

export default function chatPage() {
    return (
        <>
            <Header />
            <Chat />
            <ChatPage />
        </>
    );
}
