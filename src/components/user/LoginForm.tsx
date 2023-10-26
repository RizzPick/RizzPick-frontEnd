'use client'
import React, { useEffect } from 'react'
import Image from 'next/image';
import AuthAPI from '@/features/auth';
import { LoginReq } from '@/types/auth';
import { setCookie } from '@/utils/cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import kakaoLoginLogo from "../../../public/images/kakaoLogo.png";
import UseProfile from '@/hooks/useProfile';

function LoginForm() {
    const {
        register,
        handleSubmit,
      } = useForm<LoginReq>();
    
      const router = useRouter();
      const params = useSearchParams();
      const message = params.get('message');
      const { initializeUserActiveStatus, initializeUserInfo } = UseProfile();

      const kakaoLogin = () => {
        // window.location.href = `${process.env.NEXT_PUBLIC_KAKAO_AUTH_URL}`;
        window.location.href = `${process.env.NEXT_PUBLIC_KAKAO_AUTH_URL_VERCEL}`;
      };

      const onSubmit = async (data: LoginReq) => {
        try {
          const res = await AuthAPI.login(data);
      
          if (res.status !== 200) {
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
            return;
          }
      
          const token = res.headers['authorization'];
          const refreshToken = res.headers['authorization_refresh'];
          setCookie('Authorization', token);
          setCookie('Authorization_Refresh', refreshToken);
      
          const userStatusResponse = await AuthAPI.getUserStatus();
          initializeUserActiveStatus(userStatusResponse.data);
      
          const userInfoResponse = await AuthAPI.getUserInfo();
          initializeUserInfo(userInfoResponse.data);
      
          if (userStatusResponse.data.data.userActiveStatus) {
            router.replace('/user/match');
          } else {
            alert("프로필 등록 페이지로 이동합니다");
            router.replace('/profile/edit');
          }
      
        } catch (error: any) {
          if (error.response) {
            const errorMessage = error.response.data;
            alert(errorMessage);
          } else if (error.request) {
            console.log("No response received:", error.request);
            alert("서버 응답이 없습니다. 다시 시도해주세요.");
          } else {
            console.log("Axios configuration error:", error.message);
            alert("요청 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        }
      };
      

      // useEffect(()=>{
      //   message && alert("잘못된 접근입니다, 로그인이 필요합니다.");
      // },[message])

      return (
        <section className='min-h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2 bg-white rounded-xl shadow-xl w-[600px]">
              <Image src={kakaoLoginLogo} alt='로고' width={100} height={50} priority className='mx-auto' />
                <label className="font-bold text-xl">아이디</label>
                <input
                    id="username"
                    type="text"
                    className="border rounded-3xl py-2 px-3 w-full text-sm"
                    placeholder='아이디를 입력하세요'
                    {...register("username", { required: true })}
                />
                <label className="font-bold text-xl mt-4">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    className="border rounded-3xl py-2 px-3 w-full text-sm"
                    placeholder='비밀번호를 입력하세요'
                    {...register("password", { required: true })}
                />
                <button className='bg-gradient-start text-white p-2 rounded-3xl w-full mt-4'>로그인</button>
                <div className="mt-4 cursor-pointer mx-auto">
                    <Image src={kakaoLoginLogo} priority width={50} height={50} alt="카카오 로그인" onClick={kakaoLogin} />
                </div>
                <button type="button" className='text-gray-400 mt-4 font-medium text-sm' onClick={()=>router.push('/signup')}>회원가입하기</button>
            </form>
        </section>
      );
}

export default LoginForm