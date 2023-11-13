'use client'
import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import ChatAPI from '@/features/chat';
import { Client } from '@stomp/stompjs';
import { ChatData, MessagesRes } from '@/types/chat';
import { getCookie } from '@/utils/cookie';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import useSWR from 'swr';

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
  const token = getCookie('Authorization');

function ChatProvider({ children } : ChatProviderProps) {
    const [messages, setMessages] = useState<Record<number, MessagesRes[]>>({}); // 읽지 않은 메시지 처리 가능할듯?
    const { data: chats } = useSWR<ChatData[]>(CHAT_KEY);
    const webSocketClients = useRef<Map<number, Client>>(new Map());
    const { initializeChats } = UseChat();

    console.log(messages);
    console.log(chats);

    useEffect(()=>{
        const getChatRooms = async() => {
            try {
                const response = await ChatAPI.getChats();
                if(response.status === 200) {
                    initializeChats(response.data);
                }   
            } catch (error) {
            console.log(error);
            }
        }
        getChatRooms();
    },[initializeChats])

    // 메시지 업데이트 함수
    const updateMessages = (newMessage:MessagesRes, chatRoomId:number) => {
        setMessages(prevMessages => ({
            ...prevMessages,
            [chatRoomId]: [...(prevMessages[chatRoomId] || []), newMessage]
        }));
    };

    // 채팅방 구독 및 메시지 수신 로직
    useEffect(() => {
        if (!token || !chats) return;
        const subscribeToChatRoom = (chatRoomId:number) => {
            const client = new Client({
                brokerURL: `wss://willyouback.shop/chatroom`,
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
                    console.log(messageData);
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
            currentWebSocketClients.forEach((client, chatRoomId) => {
                if (client.connected) {
                    client.deactivate();
                }
                currentWebSocketClients.delete(chatRoomId);
            });
        };
    }, [chats]); // chats가 변경될 때마다 구독 로직 실행

    return (
        <ChatContext.Provider value={{ messages, updateMessages }}>
            {children}
        </ChatContext.Provider>
    );
}

export { ChatContext, ChatProvider };
