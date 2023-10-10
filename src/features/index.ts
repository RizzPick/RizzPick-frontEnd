import axios from 'axios';
import AuthAPI from './auth';

// 서버의 도메인주소
// 캐시, 데이터 형식 ...
const service = axios.create({});

service.interceptors.request.use((req) => req);

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
    // config.sent = true;
    // // const { headers } = await AuthAPI.refresh();
    // const accessToken = headers.authorization;
    // console.log(accessToken);

    // if (accessToken) {
    //   localStorage.setItem('accessToken', accessToken);
    //   config.headers.Authorization = `${accessToken}`;
    // }

    // return service(config);
  }
);

export default service;
