'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import AuthAPI from '@/features/auth';
import { LoginReq } from '@/types/auth';
import { setCookie } from '@/utils/cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import kakaoLoginLogo from '../../../public/images/kakaoLogo.png';
import UseProfile from '@/hooks/useProfile';
import Logo from '../../../public/RizzPickLogo.png';
import LogoColor from '../../../public/RizzPick_color.png';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import { AiOutlineUnlock } from 'react-icons/ai';


type JwtPayload  = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  auth? : string;
}

function LoginForm() {
    const { register, handleSubmit } = useForm<LoginReq>();

    const router = useRouter();
    const params = useSearchParams();
    const message = params.get('message');
    const activate = async () => {
        try {
          const response = await AuthAPI.activateUser();
          if(response.status === 200) {
            setCookie("status", "true");
            toast.success("활성화 처리되었습니다");
            router.push("/user/match");
            return;
          }
        } catch (error) {
          console.log(error);
        }
        
      }
    const { initializeUserActiveStatus, initializeUserInfo } = UseProfile();

    const kakaoLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_KAKAO_AUTH_URL_VERCEL}`;
    };

    const onSubmit = async (data: LoginReq) => {
        try {
            const res = await AuthAPI.login(data);
            console.log(res);
            if (res.status !== 200) {
                toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
                return;
            }

            const token = res.headers['authorization'];
            const { auth }: JwtPayload = jwtDecode<JwtPayload>(token);
            const refreshToken = res.headers['authorization_refresh'];
            setCookie('Authorization', token);
            setCookie('Authorization_Refresh', refreshToken);

            const userInfoResponse = await AuthAPI.getUserInfo();
            initializeUserActiveStatus(userInfoResponse.data.data.userActiveStatus);
            initializeUserInfo(userInfoResponse.data);
            const isNew = userInfoResponse.data.data.new;

            if( auth === "ADMIN" ) {
                toast.success("관리자 계정으로 접속하였습니다.")
                router.push('/admin');
                return;
            } 

            if (userInfoResponse.data.data.userActiveStatus) {
                toast.success('로그인 성공');
                router.replace('/user/match');
            } else if (!userInfoResponse.data.data.userActiveStatus && !isNew) {
                toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-center">
                          <div className="flex text-3xl">
                            <AiOutlineUnlock/>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              현재 로그인 한 계정이 비활성화된 상태입니다
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              활성화 하시겠습니까?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex border-l border-gray-200">
                        <button
                          onClick={() => {toast.dismiss(t.id), activate()}}
                          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          활성화
                        </button>
                      </div>
                    </div>
                  ), {duration : 5000})
            } else {
                toast('프로필 등록이 필요합니다', { icon: '✏️' });
                router.replace('/profile/edit');
            }
        } catch (error: any) {
            toast.error('아이디 또는 비밀번호가 틀렸습니다.');
        }
    };

    useEffect(() => {
        message && toast.error('잘못된 접근입니다, 로그인이 필요합니다');
    }, [message]);

    return (
        <section className={`h-[100vh] flex justify-center items-center`}>
            <div className="w-32 h-20 absolute top-[70px] sm:block hidden">
                <Image
                    src={Logo}
                    alt="로고"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sm:absolute sm:bottom-0 p-8 flex flex-col gap-2 bg-white rounded-xl shadow-xl sm:rounded-none sm:rounded-tl-[56px] w-[600px] sm:w-[100vw] sm:h-[80vh] h-[100vh-200px]"
            >
                <div className="w-[188px] h-[120px] relative mx-auto mt-10 sm:hidden">
                    <Image
                        src={LogoColor}
                        alt="로고"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <label className="font-bold text-xl mt-10">아이디</label>
                <input
                    id="username"
                    type="text"
                    className="border rounded-3xl py-2 px-3 w-full text-sm"
                    required
                    placeholder="아이디를 입력하세요"
                    {...register('username', { required: true })}
                />
                <label className="font-bold text-xl mt-4">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    className="border rounded-3xl py-2 px-3 w-full text-sm"
                    placeholder="비밀번호를 입력하세요"
                    required
                    {...register('password', { required: true })}
                />
                <button className="bg-gradient-start text-white p-2 rounded-3xl w-full mt-4 sm:mt-[47px] h-[60px] sm:h-[44px]">
                    로그인
                </button>
                <div className="mt-6 cursor-pointer mx-auto">
                    <Image
                        src={kakaoLoginLogo}
                        priority
                        width={50}
                        height={50}
                        alt="카카오 로그인"
                        onClick={kakaoLogin}
                    />
                </div>
                <button
                    type="button"
                    className="text-gray-400 mt-8 font-medium text-sm"
                    onClick={() => router.push('/signup')}
                >
                    회원가입하기
                </button>
            </form>
        </section>
    );
}

export default LoginForm;
