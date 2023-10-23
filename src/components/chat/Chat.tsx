'use client'
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '../../../public/chatIcon/send.svg';
import ChatAPI from '@/features/chat';
import useSWR from 'swr';
import { getCookie } from '@/utils/cookie';
import { Client } from '@stomp/stompjs';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import { ChatData, MessagesRes } from '@/types/chat';
import Image from 'next/image';
import moment from 'moment';

const Chat = () => {

    const [message, setMessage] = useState(""); // 메시지를 위한 상태 추가
    const [messages, setMessages] = useState<MessagesRes[]>();
    const { data:chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
    const fullToken = getCookie('Authorization');
    const MY_TOKEN = fullToken?.split(' ')[1];
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const client = useRef(
      new Client({
        brokerURL: "wss://willyouback.shop/chatroom",
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })
    );

    const stompSendFn = (des: any, body: any) => {
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
                console.log(response);
            }
        } catch(error) {
            console.log(error);
        }
    }
    const messageCallbackHandler = (message: any) => {
      const msgData = JSON.parse(message.body);
      const newData = {
        chatRoomId : msgData.chatRoomId,
        message: msgData.message,
        sender: msgData.sender,
        time : msgData.time
      };
      console.log(newData);
      setMessages(prevMessages => [...(prevMessages || []), newData]);
    };
    
    const currentClient = client.current;
    currentClient.onConnect = () => {
      console.log("소켓 연결완료✅");
      currentClient.subscribe(`/topic/${chat?.chatRoomId}/message`, messageCallbackHandler);
      currentClient.subscribe(`/topic/${chat?.chatRoomId}/user`, userCallbackHandler);
      stompSendFn("/app/user", { status: "JOIN", token: MY_TOKEN, chatRoomId:chat?.chatRoomId, message: "소켓연결됨" });
    };
    currentClient.activate();
    getMessages();
    return () => {
      if (currentClient.connected) {
        stompSendFn("/app/user", {
          status: "LEAVE",
          token: MY_TOKEN,
          chatRoomId : chat?.chatRoomId,
          message: "소켓연결종료",
        });
        currentClient.deactivate();
      }
    };
  }, [MY_TOKEN, chat?.chatRoomId]);  

  const onClick = () => {
    if (message.trim()) { // 메시지가 비어있지 않을 때만 전송
      // const replaceMessage = message.replaceAll("<br>", "\r\n");
      stompSendFn("/app/message", {
        token : MY_TOKEN,
        chatRoomId: chat?.chatRoomId,
        status: "MESSAGE",
        message: message // 입력된 메시지 전송
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

  const userCallbackHandler = (message: any) => {
    console.log((JSON.parse(message.body)));
  };

  
    return (
      <div className='col-span-2'>
        {/* 채팅창 */}
        <div className='w-full relative h-[700px] border-8 border-gray-400 rounded-3xl p-4'>
          {/* 메시지 출력 부분 */}
          <div className="h-[calc(700px-100px)] overflow-y-auto pb-4 scrollbar-hide">
            {messages && (() => {
              const groupedByDate: Record<string, MessagesRes[]> = {};
              messages.forEach(mes => {
                const date = moment(mes.time).format('YYYY-MM-DD');
                if (!groupedByDate[date]) {
                  groupedByDate[date] = [];
                }
                groupedByDate[date].push(mes);
              });

              return Object.entries(groupedByDate).map(([date, messagesForDate]) => (
                <div key={date}>
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="flex-shrink mx-4">{date}</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  {messagesForDate.map(mes => (
                      <div key={mes.time} className={`flex ${mes.sender === chat?.users[0] ? 'justify-start' : 'justify-end'}`}>
                          {mes.sender === chat?.users[0] ?
                              (<div className='flex items-center gap-2 mb-2 relative' ref={messagesEndRef}>
                                  <Image src={chat.image} alt='프로필 이미지' width={30} height={30} priority className='rounded-full' />
                                  <p className='bg-gray-200 rounded-3xl px-4 py-2 whitespace-pre-line'>
                                      {mes.message}
                                  </p>
                                  <span className="text-gray-500 absolute bottom-0 -right-20 mb-1 mr-2 text-sm">{moment(mes.time).format('A h:mm')}</span>
                              </div>) :
                              (<div className='flex items-center mb-2 relative' ref={messagesEndRef}>
                                  <p className='bg-gray-400 rounded-3xl px-4 py-2 whitespace-pre-line'>
                                      {mes.message}
                                  </p>
                                  <span className="text-gray-500 absolute bottom-0 -left-20 mb-1 mr-2 text-sm">{moment(mes.time).format('A h:mm')}</span>
                              </div>)}
                      </div>
                  ))}
                </div>
              ));
            })()}
          </div>
          {/* 메시지 입력 부분 */}
          <div className="flex justify-between items-center rounded-2xl bg-gray-100 px-2 py-1 mx-4 absolute inset-x-0 bottom-0 mb-4">
          <textarea
              className="bg-gray-100 w-full resize-none"
              rows={2}
              placeholder='내용을 입력하세요...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={onClick}><SendIcon/></button>
          </div>
        </div>
      </div>
    );
}

export default Chat;
