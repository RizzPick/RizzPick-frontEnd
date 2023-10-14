'use client'
import React, { useEffect } from 'react'
import Image from 'next/image';
import AuthAPI from '@/features/auth';
import { LoginReq } from '@/types/auth';
import { setCookie } from '@/utils/cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import kakaoLoginLogo from "../../../public/kakao_login.png";
import service from '@/features';

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<LoginReq>();
    
      const router = useRouter();
      const params = useSearchParams();
      const message = params.get('message');

      const kakaoLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_KAKAO_AUTH_URL}`;
      };

      const onSubmit = async (data:LoginReq) => {
        try {
          const res = await AuthAPI.login(data);
          if(res.status === 200) {
            console.log(res);
            const token = res.headers['authorization'];
            const refreshToken = res.headers['authorization_refresh'];
            setCookie('Authorization', token);
            setCookie('Authorization_Refresh',refreshToken);
            const {data} = await AuthAPI.getUserStatus();
            const status = data.data.userActiveStatus;
            {status && router.replace('/')}
            {!status && router.replace('/user/profile/edit')}
          }
          console.log(res)
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(()=>{
        message && alert("잘못된 접근입니다, 로그인이 필요합니다.");
      },[message])

      return (
        <section className='bg-blue-400 min-h-screen flex justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6 bg-white rounded-xl shadow-xl w-96">
            <label className="font-bold text-xl">Username</label>
            <input
                id="username"
                type="text"
                className="border rounded-md p-2 w-full"
                {...register("username", { required: true })}
            />
            {errors.username && <p className="text-red-500">This username field is required</p>}

            <label className="font-bold text-xl">Password</label>
            <input
                id="password"
                type="password"
                className="border rounded-md p-2 w-full"
                {...register("password", { required: true })}
            />
            {errors.password && <p className="text-red-500">This password field is required</p>}

            <button className='bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl w-full mt-4 transition duration-200 ease-in-out'>로그인</button>
            <button className='bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl w-full mt-4 transition duration-200 ease-in-out' onClick={()=>router.push('/user/signup')}>회원가입</button>
            <div className="mt-4 cursor-pointer">
                <Image src={kakaoLoginLogo} priority width={300} height={200} alt="카카오 로그인" onClick={kakaoLogin} />
            </div>
        </form>
    </section>
      );
}

export default LoginForm