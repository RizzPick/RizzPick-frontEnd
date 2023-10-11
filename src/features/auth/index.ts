import service from '@/features';

import type { LoginReq, SignupReq } from '@/types/auth';

const AuthAPI = {
  login: (data: LoginReq) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, data),
  join: (data: SignupReq) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/signup`, data),
  kakaoLogin: (code: string | null) => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/kakao/callback?code=${code}`),
  emailAuth : (data:string) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email`, data)
};

export default AuthAPI;
