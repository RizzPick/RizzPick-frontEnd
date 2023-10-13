import service from '@/features';

import type { EmailVerifyReq, EmailVerifyRes, LoginReq, SignupReq, SignupRes } from '@/types/auth';
import { getCookie } from '@/utils/cookie';
import { AxiosResponse } from 'axios';

const AuthAPI = {
  login: (data: LoginReq) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, data),
  join: (data: SignupReq) : Promise<AxiosResponse<SignupRes>> => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/signup`, data),
  kakaoLogin: (code: string | null) => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/kakao/callback?code=${code}`),
  emailAuth : (email:string) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email`, { email }),
  emailAuthVerify : (data:EmailVerifyReq) : Promise<AxiosResponse<EmailVerifyRes>> => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email/verify`, data),
  getUserStatus: () => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/status`, {
    headers : {
      Authorization : getCookie('Authorization'),
    Authorization_Refresh : getCookie('Authorization_Refresh')
    }
  })
};

export default AuthAPI;
