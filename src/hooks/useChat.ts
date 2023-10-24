import { ChatData } from "@/types/chat";
import { useCallback } from "react";
import { mutate } from "swr";

export const CHAT_KEY = "/user/chat";
export const CURRENT_CHAT_KEY = "/current-chat";


const UseChat = () => {
    
    const initializeChats = useCallback((chats : ChatData[]) => {
        mutate(CHAT_KEY, chats);
    },[])

    const setCurrentChat= useCallback((chat : ChatData)=> {
        mutate(CURRENT_CHAT_KEY, chat);
    },[]);

    return {
        initializeChats,
        setCurrentChat
    }
}
export default UseChat