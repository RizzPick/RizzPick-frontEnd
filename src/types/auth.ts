export type LoginReq = {
    username: string;
    password: string;
  };

export type SignupReq = {
    username : string;
    password : string;
    email : string;
}

export type SignupForm = SignupReq & { password_confirm : string};

export type KakaoLoginRes = {
  data : KakaoLoginResData;
  message? : string;
  status : string;
}

type KakaoLoginResData = {
  userId : number;
  userActiveStatus : boolean;
}