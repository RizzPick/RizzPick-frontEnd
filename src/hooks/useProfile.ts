import { UserActiveStatus } from "@/types/auth";
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

    // 로그인 한 유저의 프로필 등록 상태를 저장하는 함수
    const initializeUserActiveStatus = useCallback((userAcitiveStatus : UserActiveStatus) => {
        console.log(userAcitiveStatus);
        mutate(USER_STATUS_KEY,userAcitiveStatus);
        if(userAcitiveStatus && userAcitiveStatus.userActiveStatus) {
            setCookie('status', 'true')
        } else {
            setCookie('status', 'false')
        }
    },[])

    const setCurrentProfile = useCallback((profile : MyProfileRes)=> {
        mutate(PROFILE_KEY, profile);
    },[]);

    return {
        initializeProfile,
        setCurrentProfile,
        initializeUserActiveStatus,
        initializeUserInfo
    }
}
export default UseProfile