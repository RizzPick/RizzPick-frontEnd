export type ChatData = {
    chatRoomId : number;
    image : string;
    latestMessage? : string;
    nickname : string;
    users : string[];
}

export type MessagesRes = {
    chatRoomId? : number;
    message : string;
    sender : string;
    time : string;
}