import { ChatData, ChatDetail } from "@/types/chat";
import { useCallback } from "react";
import { mutate } from "swr";

export const CHAT_KEY = "/user/chat";
export const CURRENT_CHAT_KEY = "/current-chat";
export const CHAT_MESSAGE_KEY = "/user/chat/message";


const UseChat = () => {
    
    const initializeChats = useCallback((chats : ChatData[]) => {
        mutate(CHAT_KEY, chats);
    },[])

    const setCurrentChat= useCallback((chat : ChatData)=> {
        mutate(CURRENT_CHAT_KEY, chat);
    },[]);

    const clearCurrentChat = useCallback(() => {
        mutate(CURRENT_CHAT_KEY, null)
    }, []);

    const initializeChat = useCallback((chat: ChatDetail) => {
        mutate(CHAT_MESSAGE_KEY, chat);
    },[]);

    const clearCurrentChatMessage = useCallback(() => {
        mutate(CHAT_MESSAGE_KEY, null)
    }, []);

    return {
        initializeChats,
        setCurrentChat,
        clearCurrentChat,
        initializeChat,
        clearCurrentChatMessage
    }
}
export default UseChat