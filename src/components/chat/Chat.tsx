'use client'
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '../../../public/chatIcon/send.svg';
import MoreIcon from '../../../public/chatIcon/more.svg';
import ChatAPI from '@/features/chat';
import useSWR from 'swr';
import { getCookie } from '@/utils/cookie';
import { Client } from '@stomp/stompjs';
import { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import { MessagesRes } from '@/types/chat';

const Chat = () => {

    const [message, setMessage] = useState(""); // 메시지를 위한 상태 추가
    const [messages, setMessages] = useState<MessagesRes[]>();
    const { data:chatRoomId, isValidating } = useSWR<number>(CURRENT_CHAT_KEY);
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
      client.current.publish({
        destination: des,
        headers: {},
        body: JSON.stringify(body),
      });
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

  const userCallbackHandler = (message: any) => {
    console.log((JSON.parse(message.body)));
  };
  
    return (
        <div>
            {/* 채팅창 */}
            <div className="flex-grow h-screen border-r-[2px] border-l-[2px] border-s-1-black-900">
                <div className="rounded-2xl bg-slate-800 h-[80vh] my-10 pl-7 pt-7">
                    <div className="rounded-2xl bg-white w-[586px] h-[72vh]">
                        {/* 채팅내용 */}
                        <div>
                            {messages && messages.map((message)=>{
                              return (
                              <div key={message.time}>
                                <p>{message.sender}</p>
                                <p>{message.message}</p>
                              </div>)
                            })}
                        </div>
                        <div className="flex-grow h-[66vh]  border-b-[2px] border-s-2-#BBBBBB ">
                        {/* 보내는 구간 */}
                        <div className=" flex relative items-center h-4 my-4 mx-1 ">
                            <button>
                                <MoreIcon />
                            </button>
                            <input
                                className=" mx-1 w-full h-8 pr-[20px] rounded-2xl p-2 focus:outline-none border-[2px] border-s-2-#BBBBBB"
                                type="text" 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                placeholder="내용을 입력해주세요!!"
                            />
                            <button onClick={onClick}>
                                <SendIcon />
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
