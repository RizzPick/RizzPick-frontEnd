import { Client } from "@stomp/stompjs";

export const stompSendFn = (client: Client, des: any, body: any) => {
  client.publish({
    destination: des,
    headers: {},
    body: JSON.stringify(body),
  });
};