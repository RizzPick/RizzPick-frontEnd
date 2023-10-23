'use client'
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '../../../public/chatIcon/send.svg';
import ChatAPI from '@/features/chat';
import useSWR from 'swr';
import { getCookie } from '@/utils/cookie';
import { Client } from '@stomp/stompjs';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import { MessagesRes } from '@/types/chat';
import { UserInfo } from '@/types/user';
import { USER_INFO_KEY } from '@/hooks/useProfile';

const Chat = () => {

    const [message, setMessage] = useState(""); // 메시지를 위한 상태 추가
    const [messages, setMessages] = useState<MessagesRes[]>();
    const { data:chatRoomId, isValidating:chatRoomIdValidating } = useSWR<number>(CURRENT_CHAT_KEY);
    const { data:userInfo, isValidating:userInfoValidating} = useSWR<UserInfo>(USER_INFO_KEY);
    const fullToken = getCookie('Authorization');
    const MY_TOKEN = fullToken?.split(' ')[1];

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
  
    const messageCallbackHandler = (message: any) => {
      const msgData = JSON.parse(message.body);
      const newData = {
        message: [msgData.message],
        sender: msgData.sender,
      };
      console.log(newData);
    };

  useEffect(() => {
    const getMessages = async() => {
        if(!chatRoomId) {
            return;
        }
        try {
            const response = await ChatAPI.getChatMessages(chatRoomId);
            if(response.status === 200) {
                setMessages(response.data);
                console.log(response);
            }
        } catch(error) {
            console.log(error);
        }
    }
    const currentClient = client.current;
    currentClient.onConnect = () => {
      console.log("소켓 연결완료✅");
      currentClient.subscribe(`/topic/${chatRoomId}/message`, messageCallbackHandler);
      currentClient.subscribe(`/topic/${chatRoomId}/user`, userCallbackHandler);
      stompSendFn("/app/user", { status: "JOIN", token: MY_TOKEN, chatRoomId, message: "소켓연결됨" });
    };
    currentClient.activate();
    getMessages();
    return () => {
      if (currentClient.connected) {
        stompSendFn("/app/user", {
          status: "LEAVE",
          token: MY_TOKEN,
          chatRoomId,
          message: "소켓연결종료",
        });
        currentClient.deactivate();
      }
    };
  }, [MY_TOKEN, chatRoomId]);  

  const onClick = () => {
    if (message.trim()) { // 메시지가 비어있지 않을 때만 전송
      stompSendFn("/app/message", {
        token : MY_TOKEN,
        chatRoomId,
        status: "MESSAGE",
        message: message // 입력된 메시지 전송
      });
      setMessage(""); // 메시지 초기화
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClick();
    }
  }

  const userCallbackHandler = (message: any) => {
    console.log((JSON.parse(message.body)));
  };

  
    return (
        <div className='col-span-2'>
            {/* 채팅창 */}
            <div className='w-full relative h-[600px] border-8 border-gray-400 rounded-3xl'>
              {/* 메시지 출력 부분 */}
              <div>
                {userInfo?.data.nickname}
              </div>

              {/* 메시지 입력 부분 */}
              <div className="flex justify-between items-center rounded-2xl bg-gray-100 px-2 py-1 mx-4 absolute inset-x-0 bottom-0 mb-4">
                <input type="text" className="bg-gray-100 w-full" placeholder='내용을 입력하세요...' value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={handleKeyPress}/>
                <button onClick={onClick}><SendIcon/></button>
              </div>
            </div>
        </div>
    );
}

export default Chat;
