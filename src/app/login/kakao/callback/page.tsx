'use client'
import AuthAPI from "@/features/auth";
import { setCookie } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react"; // useRef 추가
import { SyncLoader } from 'react-spinners';

export default function KakaoCallback() {
    const router = useRouter();
    const kakaoOuthCodeRef = useRef<any>(null); // useRef로 변수를 초기화

    useEffect(()=>{
        kakaoOuthCodeRef.current = new URL(window.location.href).searchParams.get("code");
        const kakaoLogin = async() => {
            try{
                const response = await AuthAPI.kakaoLogin(kakaoOuthCodeRef.current);
                console.log(response);
                if(response.status === 200) {
                    const token = response.headers['authorization'];
                    const refreshToken = response.headers['authorization_refresh'];
                    setCookie('Authorization',token);
                    setCookie('Authorization_Refresh',refreshToken);
                    setCookie('status', response.data.data.userActiveStatus);
                    {response.data.data.userActiveStatus && router.push('/user/match')};
                    {!response.data.data.userActiveStatus && router.push('/profile/edit')};
                }
            } catch (error) {
                console.log(error);
            }
        };
        kakaoLogin();
    },[router])

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'  // 화면의 전체 높이를 사용합니다.
        }}>
            <SyncLoader/>
        </div>
    );
}