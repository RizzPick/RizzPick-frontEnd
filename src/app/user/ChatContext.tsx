import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import ChatAPI from '@/features/chat';
import { Client } from '@stomp/stompjs';
import { ChatData, MessagesRes } from '@/types/chat';

interface ChatContextType {
    messages: Record<number, MessagesRes[]>;
    updateMessages: (newMessage: MessagesRes, chatRoomId: number) => void;
  }
  
  // Context 생성 및 초기값 설정
  const ChatContext = createContext<ChatContextType>({
    messages: {},
    updateMessages: () => {},
  });
  
  interface ChatProviderProps {
    children: ReactNode; // children의 타입을 ReactNode로 명시합니다.
  }

function ChatProvider({ children } : ChatProviderProps) {
    const [chats, setChats] = useState<ChatData[]>([]); // ChatData 타입을 배열로 설정
    const [messages, setMessages] = useState<Record<number, MessagesRes[]>>({}); // messages의 타입을 설정
    const webSocketClients = useRef<Map<number, Client>>(new Map());

    // 메시지 업데이트 함수
    const updateMessages = (newMessage:MessagesRes, chatRoomId:number) => {
        setMessages(prevMessages => ({
            ...prevMessages,
            [chatRoomId]: [...(prevMessages[chatRoomId] || []), newMessage]
        }));
    };

    // 채팅방 구독 및 메시지 수신 로직
    useEffect(() => {
        const subscribeToChatRoom = (chatRoomId:number) => {
            const client = new Client({
                brokerURL: `wss://willyouback.shop/chatroom/${chatRoomId}`,
                debug: function (str: string) {
                    console.log(str);
                  },
                  reconnectDelay: 5000,
                  heartbeatIncoming: 4000,
                  heartbeatOutgoing: 4000,
            });

            client.onConnect = () => {
                client.subscribe(`/topic/${chatRoomId}/message`, (message) => {
                    const messageData = JSON.parse(message.body);
                    updateMessages(messageData, chatRoomId);
                });
            };

            client.activate();
            webSocketClients.current.set(chatRoomId, client);
        };

        chats.forEach(chat => {
            if (!webSocketClients.current.has(chat.chatRoomId)) {
                subscribeToChatRoom(chat.chatRoomId);
            }
        });

        const currentWebSocketClients = webSocketClients.current;

        return () => {
            // Use the captured value for cleanup
            currentWebSocketClients.forEach((client, chatRoomId) => {
                if (client.connected) {
                    client.deactivate();
                }
                currentWebSocketClients.delete(chatRoomId);
            });
        };
    }, [chats]); // chats가 변경될 때마다 구독 로직 실행

    // 채팅방 목록을 가져오는 로직
    useEffect(() => {
        const getChatRooms = async () => {
            try {
                const response = await ChatAPI.getChats();
                if (response.status === 200) {
                    setChats(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getChatRooms();
    }, []);

    return (
        <ChatContext.Provider value={{ messages, updateMessages }}>
            {children}
        </ChatContext.Provider>
    );
}

export { ChatContext, ChatProvider };
