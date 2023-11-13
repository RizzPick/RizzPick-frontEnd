export type ChatData = {
    chatRoomId: number;
    image: string;
    latestMessage?: string;
    nickname: string;
    users: string[];
    birthday: string;
    // education? : string;
    intro?: string;
    latestMessageTime?: string;
    location?: string;
    mbti?: string;
    religion?: string;
    userId?: number;
};

export type MessagesRes = {
    chatRoomId?: number;
    message: string;
    sender: string;
    time: string;
};

export type ChatRoomInfo = {
    chatRoomId: number;
    nickname: string;
    image: string;
};

export type ChatDetail = {
    userId : number;
    nickname : string;
    username : string;
    image : string;
    messages : MessagesRes[]
}