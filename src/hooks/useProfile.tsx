import { MyProfileRes } from "@/types/profile";
import { useCallback } from "react";
import { mutate } from "swr";

export const PROFILE_KEY = "/user/profile";

const UseProfile = () => {
    const initializeProfile = useCallback((profile : MyProfileRes) => {
        mutate(PROFILE_KEY, profile);
    },[])

    const setCurrentProfile = useCallback((profile : MyProfileRes)=> {
        mutate(PROFILE_KEY, profile);
    },[]);

    return {
        initializeProfile,
        setCurrentProfile
    }
}
export default UseProfile