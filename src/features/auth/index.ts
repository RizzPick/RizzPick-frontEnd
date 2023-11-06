import service from '@/features';

import type {
    ChangePasswordReq,
    EmailVerifyReq,
    EmailVerifyRes,
    LoginReq,
    SignupReq,
    SignupRes,
} from '@/types/auth';
import { AxiosResponse } from 'axios';

const AuthAPI = {
    login: (data: LoginReq) =>
        service.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
            data
        ),
    join: (data: SignupReq): Promise<AxiosResponse<SignupRes>> =>
        service.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/signup`,
            data
        ),
    kakaoLogin: (code: string | null) =>
        service.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/kakao/callback?code=${code}`
        ),
    emailAuth: (email: string) =>
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email`, {
            email,
        }),
    emailAuthVerify: (
        data: EmailVerifyReq
    ): Promise<AxiosResponse<EmailVerifyRes>> =>
        service.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/email/verify`,
            data
        ),
    getUserStatus: () =>
        service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/status`),
    getUserisNew: () =>
        service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/is-new`),
    getUserInfo: () =>
        service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/myProfile`),
    refresh: (token: string) =>
        service.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/refresh`,
            token
        ),
    changePassword: (data: ChangePasswordReq) => 
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/`)
};

export default AuthAPI;
