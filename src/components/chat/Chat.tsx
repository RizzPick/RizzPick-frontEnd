'use client'
import React, { useEffect, useRef, useState } from 'react';
import ChatAPI from '@/features/chat';
import useSWR from 'swr';
import { getCookie } from '@/utils/cookie';
import { Client } from '@stomp/stompjs';
import UseChat, { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import { ChatData, MessagesRes } from '@/types/chat';
import Image from 'next/image';
import dayjs from 'dayjs';
import ChatSkeleton from './ChatSkeleton';
import {FiArrowUp} from "react-icons/fi"
import Back from "../../../public/chatIcon/Button.svg"
import { calculateAge } from '@/utils/dateUtils';

type StompMessage = {
  body: string; 
}

type MessageData  = {
  chatRoomId: number;
  message: string;
  sender: string;
  time: string;
}


const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessagesRes[]>();
    const [isLoading, setIsLoading] = useState(true);
    const { data:chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
    const fullToken = getCookie('Authorization');
    const MY_TOKEN = fullToken?.split(' ')[1];
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { clearCurrentChat } = UseChat();

    const client = useRef<Client>(
      new Client({
        brokerURL: "wss://willyouback.shop/chatroom",
        debug: function (str: string) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })
    );
    
    const stompSendFn = (des: string, body: Record<string, unknown>) => {
      if (client.current.connected) {
        client.current.publish({
          destination: des,
          headers: {},
          body: JSON.stringify(body),
        });
      }
    };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if(!chat?.chatRoomId) {
      return;
    }
    const getMessages = async() => {
        if(!chat?.chatRoomId) {
            return;
        }
        try {
            const response = await ChatAPI.getChatMessages(chat.chatRoomId);
            if(response.status === 200) {
                setMessages(response.data.data);
                setIsLoading(false);
            }
        } catch(error) {
          setIsLoading(false);
            console.log(error);
        }
    }
    const messageCallbackHandler = (message: StompMessage) => {
      const msgData:MessageData = JSON.parse(message.body);
      const newData = {
        chatRoomId : msgData.chatRoomId,
        message: msgData.message,
        sender: msgData.sender,
        time : msgData.time
      };
      setMessages(prevMessages => [...(prevMessages || []), newData]);
    };
    const currentClient = client.current;
    currentClient.onConnect = () => {
      currentClient.subscribe(`/topic/${chat?.chatRoomId}/message`, messageCallbackHandler);
      currentClient.subscribe(`/topic/${chat?.chatRoomId}/user`, userCallbackHandler);
      stompSendFn("/app/user", { status: "JOIN", token: MY_TOKEN, chatRoomId:chat?.chatRoomId, message: "채팅방에 입장하셨습니다" });
    };
    currentClient.activate();
    getMessages();
    return () => {
      if (currentClient.connected) {
        stompSendFn("/app/user", {
          status: "LEAVE",
          token: MY_TOKEN,
          chatRoomId : chat?.chatRoomId,
          message: "채팅방을 나가셨습니다",
        });
        currentClient.deactivate();
      }
    };
  }, [MY_TOKEN, chat?.chatRoomId]);  

  const onClick = () => {
    if (message.trim()) { // 메시지가 비어있지 않을 때만 전송
      stompSendFn("/app/message", {
        token : MY_TOKEN,
        chatRoomId: chat?.chatRoomId,
        status: "MESSAGE",
        message: message,
      });
      setMessage(""); // 메시지 초기화
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 줄바꿈을 방지하기 위해 기본 동작을 방지
      onClick();
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"end" });
  };

  const userCallbackHandler = (message: StompMessage) => {
    console.log((JSON.parse(message.body)));
  };

  const backBtnClick = () => {
    clearCurrentChat();
    setMessages([]);
    setIsLoading(true);
  }

  
    return (
      <div className='relative'>
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify- items-center p-4 border-b-[1px] h-[74px]'>
            {/* {!chat && <p className='flex items-center gap-4 ml-4'><FcInfo/>왼쪽의 채팅방을 선택해주세요.</p>} */}
            {chat && 
            (
            <>
              <button className='absolute left-[15px]' onClick={backBtnClick}><Back/></button>
              <h1 className='ml-10 text-3xl font-bold'>{chat.nickname}</h1>
              <p className='px-2 bg-[#AB62E5] rounded-full text-xs text-white ml-3'>{calculateAge(chat.birthday)}</p>
            </>
            )}
        </header>
        {/* 채팅창 */}
        <div className='w-full relative h-[700px] rounded-3xl p-4'>
          {/* 메시지 출력 부분 */}
          {isLoading ? (
            <ChatSkeleton />
          ):
          (
            <>
            <div className="h-[calc(700px-120px)] overflow-y-auto pb-4 scrollbar-hide">
            {messages && (() => {
              const groupedByDate: Record<string, MessagesRes[]> = {};
              messages.forEach(mes => {
                const date = dayjs(mes.time).format('YYYY-MM-DD');
                if (!groupedByDate[date]) {
                  groupedByDate[date] = [];
                }
                groupedByDate[date].push(mes);
              });

              return Object.entries(groupedByDate).map(([date, messagesForDate]) => (
                <div key={date}>
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="flex-shrink mx-4 text-neutral-400 text-sm">{date}</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  {messagesForDate.map(mes => (
                      <div key={mes.time} className={`flex ${mes.sender === chat?.users[0] ? 'justify-start' : 'justify-end'}`}>
                          {mes.sender === chat?.users[0] ?
                              (<div className='flex items-center gap-2 mb-2 relative' ref={messagesEndRef}>
                                  <div className='relative w-[30px] h-[30px]'>
                                    <Image src={chat.image} alt='프로필 이미지' fill priority style={{objectFit:"cover"}} className='rounded-full' />
                                  </div>
                                  <p className='bg-gray-200 rounded-2xl px-4 py-2 whitespace-pre-line max-w-[70vw]'>
                                      {mes.message}
                                  </p>
                                  <span className="text-gray-500 absolute bottom-0 -right-20 mb-1 mr-2 text-sm">{dayjs(mes.time).format('A h:mm')}</span>
                              </div>) :
                              (<div className='flex flex-col items-end mb-2' ref={messagesEndRef}>
                                  <p className='bg-[#ab62e5] rounded-2xl px-4 py-2 whitespace-pre-line text-white max-w-[70vw]'>
                                      {mes.message}
                                  </p>
                                  <span className="text-gray-500 relative -bottom-1 mb-1 text-xs mr-1">{dayjs(mes.time).format('A h:mm')}</span>
                              </div>)}
                      </div>
                  ))}
                </div>
              ));
            })()}
          </div>
          <div className="flex justify-between items-center rounded-2xl bg-gray-100 px-2 py-1 mx-4 absolute inset-x-0 bottom-0 mb-4">
          <textarea
              className="bg-gray-100 w-full resize-none outline-none"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={onClick} className='bg-sendbtn-gradient text-white rounded-full text-2xl'><FiArrowUp/></button>
          </div>
          </>
          )}
        </div>
      </div>
    );
}

export default Chat;
