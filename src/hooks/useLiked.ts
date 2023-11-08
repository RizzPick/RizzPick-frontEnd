import { LikeData } from "@/types/like";
import { useCallback } from "react";
import { mutate } from "swr";

export const USER_LIKED_KEY = "/user/liked";


const UseLiked = () => {
    
    const initializeLiked = useCallback((likes : LikeData) => {
        mutate(USER_LIKED_KEY, likes);
    },[])


    return {
        initializeLiked,
    }
}
export default UseLiked