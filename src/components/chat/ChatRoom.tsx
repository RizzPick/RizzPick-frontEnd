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
  const chatRoomId = -9128315079999336103;

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
    client.current.onConnect = () => {
      console.log("소켓 연결완료✅");
      client.current.subscribe(`/topic/${chatRoomId}/message`, messageCallbackHandler);
      client.current.subscribe(`/topic/${chatRoomId}/user`, userCallbackHandler);
      stompSendFn("/app/user", {status: "JOIN", token, chatRoomId, message: "소켓연결됨"});
    };

    client.current.activate();
    return () => {
      if (client.current.connected) {  // STOMP 연결 상태 확인 추가
        stompSendFn("/app/user", {
          status: "LEAVE",
          token,
          chatRoomId,
          message: "소켓연결종료",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        client.current.deactivate();
      }
    };
  }, [chatRoomId, token]);

  const onClick = () => {
    stompSendFn("/app/message", {
        token,
        chatRoomId,
        status : "MESSAGE",
        message : "안녕하세요 석진님"
    })
  }

  const userCallbackHandler = (message:any) => {
    console.log((JSON.parse(message.body)));
  };

  return (
    <div>
        <button onClick={onClick}>전송</button>
    </div>
  );
};

export default ChatPage;
