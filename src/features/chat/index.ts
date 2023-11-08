import service from '@/features';

const ChatAPI = {
  getChats : () => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/rooms/me`),
  getChatMessages : (chatRoomId : number) => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/message/${chatRoomId}`),
  deleteChat : (matchId : number) => service.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/match/${matchId}`)
};

export default ChatAPI;
