import service from '@/features';

const ChatAPI = {
  getChatRooms : () => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/rooms/me`),
};

export default ChatAPI;
