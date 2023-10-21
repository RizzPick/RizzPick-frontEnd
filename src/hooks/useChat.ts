import { ChatData } from "@/types/chat";
import { useCallback } from "react";
import { mutate } from "swr";

export const CHAT_KEY = "/user/chat";
export const CURRENT_CHAT_KEY = "/current-chat";


const UseChat = () => {
    
    const initializeChats = useCallback((chats : ChatData[]) => {
        mutate(CHAT_KEY, chats);
    },[])

    const setCurrentChatRoom = useCallback((chatRoomId : number)=> {
        mutate(CURRENT_CHAT_KEY, chatRoomId);
    },[]);

    return {
        initializeChats,
        setCurrentChatRoom
    }
}
export default UseChat