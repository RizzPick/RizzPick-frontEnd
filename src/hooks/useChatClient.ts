import { Client } from "@stomp/stompjs";
import { stompSendFn } from "@/utils/stompUtils";
import { useEffect, useRef } from "react";

type Props = {
    chatRoomId : number;
    token : string;
    messageCallbackHandler : any;
    userCallbackHandler : any;
}

const useChatClient = ({chatRoomId, token, messageCallbackHandler, userCallbackHandler}: Props) => {
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
    const currentClient = client.current; // 로컬 변수에 저장

    currentClient.onConnect = () => {
      console.log("소켓 연결완료✅");
      currentClient.subscribe(`/topic/${chatRoomId}/message`, messageCallbackHandler);
      currentClient.subscribe(`/topic/${chatRoomId}/user`, userCallbackHandler);
      stompSendFn(currentClient, "/app/user", {status: "JOIN", token, chatRoomId, message: "소켓연결됨"});
    };

    currentClient.activate();
    return () => {
      if (currentClient.connected) {
        stompSendFn(currentClient, "/app/user", {
          status: "LEAVE",
          token,
          chatRoomId,
          message: "소켓연결종료",
        });
        currentClient.deactivate();
      }
    };
  }, [chatRoomId, token, messageCallbackHandler, userCallbackHandler]);

  return client;
};

export default useChatClient;
