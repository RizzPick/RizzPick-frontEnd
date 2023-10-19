import Header from '@/components/header/Header';
import Chat from '@/components/chat/Chat';
import ChatAPI from '@/features/chat';


export default async function ChatPage() {

    // const response = await ChatAPI.getChatRooms();
    // console.log(response);
    return (
        <>
            <Header />
            <Chat />
        </>
    );
}
