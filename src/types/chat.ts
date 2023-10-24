export type ChatData = {
    chatRoomId : number;
    image : string;
    latestMessage? : string;
    nickname : string;
    users : string[];
    age? :number;
    education? : string;
    intro? : string;
    latestMessageTime? : string;
    location? : string;
    mbti? : string;
    religion? : string;
}

export type MessagesRes = {
    chatRoomId? : number;
    message : string;
    sender : string;
    time : string;
}

export type ChatRoomInfo = {
    chatRoomId : number;
    nickname : string;
    image : string;
}