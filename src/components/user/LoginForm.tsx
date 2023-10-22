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
        window.location.href = `${process.env.NEXT_PUBLIC_KAKAO_AUTH_URL}`;
      };

      const onSubmit = async (data:LoginReq) => {
        try {
          const res = await AuthAPI.login(data);
          console.log(res);
          if(res.status === 200) {
            console.log(res);
            const token = res.headers['authorization'];
            const refreshToken = res.headers['authorization_refresh'];
            setCookie('Authorization', token);
            setCookie('Authorization_Refresh',refreshToken);

            // 이 부분 개선이 필요해 보임
            const {data} = await AuthAPI.getUserStatus();
            const status = data.data.userActiveStatus;
            initializeUserActiveStatus(data.data);
            const userInfo = await AuthAPI.getUserInfo();
            initializeUserInfo(userInfo.data);
            console.log(userInfo);
            {status && router.replace('/user/match')}
            {!status && router.replace('/profile/edit')}
            
          }
        } catch (error:any) {
          console.log(error);
          if (error.response) {
            const errorMessage = error.response.data;
            console.log(errorMessage);
            alert(errorMessage);
          } else if (error.request) {
              console.log("No response received:", error.request);
          } else {
              console.log("Axios configuration error:", error.message);
          }
        }
      };

      useEffect(()=>{
        message && alert("잘못된 접근입니다, 로그인이 필요합니다.");
      },[message])

      return (
        <section className='min-h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2 bg-white rounded-xl shadow-xl w-[600px]">
              <Image src={kakaoLoginLogo} alt='로고' width={100} height={50} priority className='mx-auto' />
                <label className="font-bold text-xl ml-2">아이디</label>
                <input
                    id="username"
                    type="text"
                    className="border rounded-3xl py-2 px-3 w-full text-sm"
                    placeholder='아이디를 입력하세요'
                    {...register("username", { required: true })}
                />
                <label className="font-bold text-xl mt-4 ml-2">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    className="border rounded-3xl py-2 px-3 w-full text-sm"
                    placeholder='비밀번호를 입력하세요'
                    {...register("password", { required: true })}
                />
                <button className='bg-gradient-start text-white p-2 rounded-3xl w-full mt-4 transition duration-200 ease-in-out'>로그인</button>
                <div className="mt-4 cursor-pointer mx-auto">
                    <Image src={kakaoLoginLogo} priority width={50} height={50} alt="카카오 로그인" onClick={kakaoLogin} />
                </div>
                <button type="button" className='text-gray-400 mt-4 font-medium text-sm' onClick={()=>router.push('/signup')}>회원가입하기</button>
            </form>
        </section>
      );
}

export default LoginForm