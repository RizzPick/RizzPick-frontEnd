'use client'
import { getCookie } from "@/utils/cookie";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

type Props = {
  chatRoomId : number |  null;
}

const ChatRoom = ({chatRoomId} : Props) => {
  const [message, setMessage] = useState(""); // 메시지를 위한 상태 추가
  // const chatRoomId = 5581755;

  useEffect(() => {
    // 토큰 추출
    const fullToken = getCookie('Authorization');
    const MY_TOKEN = fullToken?.split(' ')[1];
    
    const currentClient = client.current;
    currentClient.onConnect = () => {
      console.log("소켓 연결완료✅");
      currentClient.subscribe(`/topic/${chatRoomId}/message`, messageCallbackHandler);
      currentClient.subscribe(`/topic/${chatRoomId}/user`, userCallbackHandler);
      stompSendFn("/app/user", { status: "JOIN", token: MY_TOKEN, chatRoomId, message: "소켓연결됨" });
    };

    currentClient.activate();
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
  }, [chatRoomId]);

  

  // utils
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

  

  const onClick = () => {
    const fullToken = getCookie('Authorization');
    const MY_TOKEN = fullToken?.split(' ')[1];
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
      <input 
        type="text" 
        value={message} 
        onChange={e => setMessage(e.target.value)} 
        placeholder="메시지 입력" 
      />
      <button onClick={onClick}>전송</button>
    </div>
  );
};

export default ChatRoom;
