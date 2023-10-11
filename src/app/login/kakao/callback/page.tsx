'use client';

import AuthAPI from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KakaoCallback() {
    const router = useRouter();
    const kakaoOuthCode = new URL(window.location.href).searchParams.get(
        'code'
    );

    useEffect(() => {
        const kakaoLogin = async () => {
            try {
                const response = await AuthAPI.kakaoLogin(kakaoOuthCode);
                console.log(response);
                if (response.status === 200) {
                    {
                        response.data.data.userActiveStatus &&
                            router.replace('/');
                    }
                    {
                        !response.data.data.userActiveStatus &&
                            alert('프로필 등록을 진행합니다.');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        kakaoLogin();
    }, [kakaoOuthCode, router]);

    return <div>카카오 로그인 처리중...</div>;
}
