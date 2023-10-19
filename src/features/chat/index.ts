import service from '@/features';

const ChatAPI = {
  getChats : () => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/rooms/me`),
};

export default ChatAPI;
