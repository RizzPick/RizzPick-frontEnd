import { Cookies } from "react-cookie";
const cookies = new Cookies();

/**
 * 쿠키 저장 함수
 * @param name - 쿠키의 이름
 * @param value - 쿠키에 저장될 값
 * @param days - 쿠키의 만료일(일 단위)
 */
export const setCookie = (name: string, value: string, days?: number): void => {
    cookies.set(name, value, { path: "/", maxAge: 60 * 60 * 24 * 1 }); // 1일 동안 유효한 쿠키로 저장 : maxAge: 60 * 60 * 24 * 1
  }
  
  /**
   * 쿠키 가져오는 함수
   * @param name - 가져올 쿠키의 이름
   * @returns 쿠키의 값
   */
  export const getCookie = (name: string): string | null => {
    return cookies.get(name); // 이름에 해당하는 쿠키를 가져오도록 수정
  }
  
  /**
   * 쿠키 삭제 함수
   * @param name - 삭제할 쿠키의 이름
   */
  export const eraseCookie = (name: string): void => {
    cookies.remove(name); // 이름에 해당하는 쿠키를 제거하도록 수정
  }

  export const setRefreshToken = (name:string, value:string) => {
    // name과 value를 받도록 수정
    cookies.set(name, value, { path: "/", maxAge: 60 * 60 * 24 * 7 });
  };
  
  // 리프레시 토큰 가져오기 함수
  export const getRefreshToken = () => {
    return cookies.get("refreshToken");
  };
  
  // 리프레시 토큰 삭제 함수
  export const removeRefreshToken = () => {
    cookies.remove("refreshToken", { path: "/" });
  };
  