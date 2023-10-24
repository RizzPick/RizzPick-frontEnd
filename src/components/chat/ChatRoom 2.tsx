'use client'
import { getCookie } from "@/utils/cookie";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";


const ChatPage = () => {
    const [token, setToken] = useState<any>();
    useEffect(()=>{
        const fullToken = getCookie('Authorization');
        const MY_TOKEN = fullToken?.split(' ')[1];
        setToken(MY_TOKEN);
    },[])
  const chatRoomId = 1;

  
  // utils
  const stompSendFn = (des:any, body:any) => {
    client.current.publish({
      destination: des,
      headers: {},
      body: JSON.stringify(body),
    });
  };

  const messageCallbackHandler = (message:any) => {
    const msgData = JSON.parse(message.body);

    // 서버에서 받은 메세지 데이터를 배열로 담기위해 새로운 객체에 다시 담아준다.
    const newData = {
      message: [msgData.message],
      sender: msgData.sender,
    };

    console.log(newData);
    console.log(message);
    console.log(msgData);
  };

  // stomp
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

  useEffect(() => {
    client.current.activate();
    return () => {
      // 유저가 나갈때마다 실행
      stompSendFn("/app/user", {
        status: "LEAVE",
        token,
        chatRoomId,
        message: "소켓연결종료",
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      client.current.deactivate();
    };
  }, [token]);

  // 브라우저에서 웹소켓 지원 안할시 sockJS로 연결
  // client.current.webSocketFactory = () => {
  //   return new SockJS("http://18.206.140.108/chatroom");
  // };


  const onClick = () => {
    stompSendFn("/app/message", {
        token,
        chatRoomId,
        status : "MESSAGE",
        message : "하이 여러분"
    })
  }

  const userCallbackHandler = (message:any) => {
    console.log((JSON.parse(message.body)));
  };

  //채팅 로직
  client.current.onConnect = () => {
    console.log("소켓 연결완료✅");
    // 채팅관련 구독
    client.current.subscribe(`/topic/${chatRoomId}/message`, messageCallbackHandler);
    // user상태관련 구독
    client.current.subscribe(`/topic/${chatRoomId}/user`, userCallbackHandler);
    // 업데이트 구독
    // client.current.subscribe(`/topic/${chatRoomId}/update`, updateCallbackHandler)
    // 유저가 입장할때마다 실행(소켓연결)
    stompSendFn("/app/user", {status: "JOIN", token, chatRoomId, message: "소켓연결됨",});
  };

  return (
    <div>
        <button onClick={onClick}>전송</button>
    </div>
  );
};

export default ChatPage;
