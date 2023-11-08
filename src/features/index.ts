import { getCookie } from '@/utils/cookie';
import axios from 'axios';
import AuthAPI from './auth';

// 서버의 도메인주소
// 캐시, 데이터 형식 ...
const service = axios.create({});

service.interceptors.request.use((req) => {
    // 쿠키에서 토큰 값을 읽어옴
    const token = getCookie('Authorization');
    const refreshToken = getCookie('Authorization_Refresh');
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      req.headers['Authorization'] = token;
    }
    if (refreshToken) {
      req.headers['Authorization_Refresh'] = refreshToken;
    }
    return req;
  });

// 만료된 토큰 -> 서버로 요청 -> 서버가 인증 에러 응답 ->
service.interceptors.response.use(
  (res) => res,
  async (err) => {
    const {
      config,
      response: { status },
    } = err;

    // 1)
    // 인증 관련 에러가 아닌 경우
    if (status !== 401 || config.sent) {
      return Promise.reject(err);
    }

    /** 2 */
    if(status === 499) {
      config.sent = true;
      const refreshToken = getCookie('Authorization_Refresh');
      const token = refreshToken?.split(" ")[1];

      if(!token) return;
      const { headers } = await AuthAPI.refresh(token);
      const accessToken = headers.authorization;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return service(config);
    }
  }
);

export default service;
