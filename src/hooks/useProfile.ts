import { MyProfileRes } from "@/types/profile";
import { UserInfo } from "@/types/user";
import { setCookie } from "@/utils/cookie";
import { useCallback } from "react";
import { mutate } from "swr";

export const PROFILE_KEY = "/user/profile";
export const USER_STATUS_KEY = "/user/status";
export const USER_INFO_KEY = "/user/userinfo";


const UseProfile = () => {
    
    const initializeProfile = useCallback((profile : MyProfileRes) => {
        mutate(PROFILE_KEY, profile);
    },[])

    const initializeUserInfo = useCallback((user:UserInfo) => {
        mutate(USER_INFO_KEY, user)
    },[])

    const initializeUserActiveStatus = useCallback((userAcitiveStatus : boolean) => {
        mutate(USER_STATUS_KEY,userAcitiveStatus);
        if(userAcitiveStatus) {
            setCookie('status', 'true')
        } else {
            setCookie('status', 'false')
        }
    },[])

    const setCurrentProfile = useCallback((profile : MyProfileRes)=> {
        mutate(PROFILE_KEY, profile);
    },[]);

    const clearCurrentProfile = useCallback(() => {
        mutate(PROFILE_KEY, null)
    },[]);

    return {
        initializeProfile,
        setCurrentProfile,
        initializeUserActiveStatus,
        initializeUserInfo,
        clearCurrentProfile
    }
}
export default UseProfile