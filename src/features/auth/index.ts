import service from '@/features';

import type { LoginReq, SignupReq } from '@/types/auth';

const AuthAPI = {
  login: (data: LoginReq) => service.post('/api/auth/login', data),
  join: (data: SignupReq) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/signup`, data),
  emailAuth : (data:string) => service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email`, data)
};

export default AuthAPI;
