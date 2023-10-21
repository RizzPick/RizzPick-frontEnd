import service from '@/features';

const ChatAPI = {
  getChats : () => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/rooms/me`),
  getChatMessages : (chatRoomId : number) => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/message/${chatRoomId}`)
};

export default ChatAPI;
