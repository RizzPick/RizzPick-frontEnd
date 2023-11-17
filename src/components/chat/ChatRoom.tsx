'use client'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import UseChat from '@/hooks/useChat';
import { MessagesRes } from '@/types/chat';
import Image from 'next/image';
import dayjs from "dayjs"
import {FiArrowUp} from "react-icons/fi"
import Back from "../../../public/chatIcon/Button.svg"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChatContext } from '@/app/ChatContext';

type Props = {
  chat : any
  chatRoomId : number;
}

const ChatRoom = ({chat, chatRoomId} : Props) => {
  const [message, setMessage] = useState("");
  const { stompSendFn } = useContext(ChatContext);
  const fullToken = getCookie('Authorization');
  const MY_TOKEN = fullToken?.split(' ')[1];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { clearCurrentChat } = UseChat();

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"end" });
    };
      scrollToBottom();
  }, [chat]);

  const onClick = useCallback(() => {
    if (message.trim()) {
      stompSendFn("/app/message", {
        token : MY_TOKEN,
        chatRoomId: chatRoomId,
        status: "MESSAGE",
        message: message,
      });
      setMessage("");
    }
  }, [message, stompSendFn, MY_TOKEN, chatRoomId]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onClick();
    }
  }

  const backBtnClick = () => {
    clearCurrentChat();
    router.back();
  }
  

    return (
      <div className='relative'>
        <header className='header-sticky text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4 border-b-1'>
                <button className='absolute left-[15px]' onClick={backBtnClick}><Back/></button>
                <h1>{chat?.nickname}</h1>
        </header>
        {/* 채팅창 */}
        <div className='w-full relative h-[82vh] rounded-3xl px-3'>
            <>
            <div className="h-full overflow-y-auto pb-4 scrollbar-hide">
            {chat.messages && (() => {
              const groupedByDate: Record<string, MessagesRes[]> = {};
              chat.messages.forEach((mes:any) => {
                const date = dayjs(mes.time).format('YYYY-MM-DD');
                if (!groupedByDate[date]) {
                  groupedByDate[date] = [];
                }
                groupedByDate[date].push(mes);
              });

              return Object.entries(groupedByDate).map(([date, messagesForDate]) => (
                <div key={date}>
                  <div className="w-40 h-8 p-2.5 flex items-center justify-center bg-neutral-200 mx-auto rounded-2xl my-4">
                    <span className="mx-4 text-white">{date}</span>
                  </div>
                  {messagesForDate.map(mes => (
                      <div key={mes.time} className={`flex ${mes.sender === chat?.username ? 'justify-start' : 'justify-end'}`}>
                          {mes.sender === chat?.username ?
                              (<div className='flex items-center gap-2 mb-2 relative max-w-[70vw]' ref={messagesEndRef}>
                                <Link href={`/user/profile/${chat.userId}`}>
                                <div className='relative w-[30px] h-[30px]'>
                                  <Image src={chat.image} alt='프로필 이미지' fill priority style={{objectFit:'cover'}} className='rounded-full' />
                                </div>
                                </Link>
                                  <p className='bg-gray-200 rounded-2xl px-3 py-2 whitespace-pre-line max-w-[60vw]' id={mes.message} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                      {mes.message}
                                  </p>
                                  <span className="text-gray-500 absolute bottom-0 -right-20 mb-1 mr-2 text-sm">{dayjs(mes.time).format('A h:mm')}</span>
                              </div>) :
                              (<div className='flex flex-col items-end mb-2' ref={messagesEndRef}>
                                  <p className='bg-[#ab62e5] rounded-2xl px-3 py-2 whitespace-pre-line text-white max-w-[70vw]'>
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
          <div className="textarea-sticky absolute inset-x-0 bottom-0 flex justify-between items-center rounded-2xl bg-gray-100 px-4 py-1 mx-4 h-[44px]">
            <textarea
                className="bg-gray-100 w-full resize-none"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder='내용을 입력하세요'
                />
                <button onClick={onClick} className='bg-sendbtn-gradient text-white rounded-full text-2xl'><FiArrowUp/></button>
          </div>
          </>
        </div>
      </div>
    );
}

export default ChatRoom;
