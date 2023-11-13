'use client'
import React, { createContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import ChatAPI from '@/features/chat';
import { Client } from '@stomp/stompjs';
import { ChatData, ChatDetail, MessagesRes } from '@/types/chat';
import { getCookie } from '@/utils/cookie';
import UseChat, { CHAT_KEY, CHAT_MESSAGE_KEY } from '@/hooks/useChat';
import useSWR from 'swr';

interface ChatContextType {
    updateMessages: (newMessage: MessagesRes, chatRoomId: number) => void;
    stompSendFn: (destination: string, body: Record<string, unknown>) => void;
}
  
const ChatContext = createContext<ChatContextType>({
    updateMessages: () => {},
    stompSendFn: () => {},
});

interface ChatProviderProps {
    children: ReactNode;
}

const token = getCookie('Authorization');

function ChatProvider({ children }: ChatProviderProps) {

    const { data : chats } = useSWR<ChatData[]>(CHAT_KEY);
    const { data : chat } = useSWR<ChatDetail>(CHAT_MESSAGE_KEY);
    const webSocketClients = useRef<Map<number, Client>>(new Map());
    const { initializeChats, initializeChat } = UseChat();

    const client = useRef<Client>(new Client({
        brokerURL: `wss://willyouback.shop/chatroom`,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    }));

    useEffect(() => {
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
    }, [initializeChats]);

    useEffect(() => {
        client.current.activate();
    }, []);

    const updateMessages = useCallback((newMessage: MessagesRes, chatRoomId: number) => {

        if(!chats) return;
        const updatedChats = chats.map(chat => 
            chat.chatRoomId === chatRoomId ? { ...chat, latestMessage: newMessage.message } : chat
        );
        initializeChats(updatedChats);

        if (chat) {
            const updatedChatMessages = [...chat.messages, newMessage];
            initializeChat({ ...chat, messages: updatedChatMessages });
        }
    }, [chat, chats, initializeChat, initializeChats]);

    const stompSendFn = (destination: string, body: Record<string, unknown>) => {
        if (client.current.connected) {
            client.current.publish({
                destination,
                headers: {},
                body: JSON.stringify(body),
            });
        } else {
            console.error("웹소켓 연결이 활성화되어 있지 않습니다.");
        }
    };

    useEffect(() => {
        if (!token || !chats) return;
    
        const subscribeToChatRoom = (chatRoomId: number) => {
            const existingClient = webSocketClients.current.get(chatRoomId);
            if (existingClient && existingClient.connected) {
                return;
            }
            const newClient = new Client({
                brokerURL: `wss://willyouback.shop/chatroom`,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            newClient.onConnect = () => {
                newClient.subscribe(`/topic/${chatRoomId}/message`, (message) => {
                    const messageData = JSON.parse(message.body);
                    updateMessages(messageData, chatRoomId);
                });
            };
            newClient.activate();
            webSocketClients.current.set(chatRoomId, newClient);
        };
    
        chats.forEach(chat => {
            subscribeToChatRoom(chat.chatRoomId);
        });
    
        const currentWebSocketClients = webSocketClients.current;
    
        return () => {
            currentWebSocketClients.forEach((client, chatRoomId) => {
                client.deactivate();
                currentWebSocketClients.delete(chatRoomId);
            });
        };
    }, [chats, updateMessages]);
    

    return (
        <ChatContext.Provider value={{ updateMessages, stompSendFn }}>
            {children}
        </ChatContext.Provider>
    );
}

export { ChatContext, ChatProvider };
