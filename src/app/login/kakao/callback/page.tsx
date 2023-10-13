'use client'
import AuthAPI from "@/features/auth";
import { setCookie, setRefreshToken } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react"; // useRef 추가

export default function KakaoCallback() {
    const router = useRouter();
    const kakaoOuthCodeRef = useRef<any>(null); // useRef로 변수를 초기화

    useEffect(()=>{
        kakaoOuthCodeRef.current = new URL(window.location.href).searchParams.get("code"); // .current를 사용하여 값을 저장

        const kakaoLogin = async() => {
            try{
                const response = await AuthAPI.kakaoLogin(kakaoOuthCodeRef.current); // .current를 사용하여 값에 접근
                console.log(response);
                if(response.status === 200) {
                    console.log(response);
                    const token = response.headers['authorization'];
                    const refreshToken = response.headers['authorization_refresh'];
                    setCookie('Authorization',token);
                    setRefreshToken('Authorization_Refresh', refreshToken);
                    {response.data.data.userActiveStatus && router.push('/')};
                    {!response.data.data.userActiveStatus && router.push('/user/profil/edit')};
                }
            } catch (error) {
                console.log(error);
            }
        };
        kakaoLogin();
    },[router])

    return <div>카카오 로그인 처리중...</div>;
}
