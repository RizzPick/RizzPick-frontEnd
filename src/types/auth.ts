export type LoginReq = {
    username: string;
    password: string;
  };

export type SignupReq = {
    username : string;
    password : string;
    email : string;
}

export type SignupRes = {
  data? : string
  message? : string;
  status : string;
}

export type SignupForm = SignupReq & { password_confirm : string};

export type KakaoLoginRes = {
  data : KakaoLoginResData;
  message? : string;
  status : string;
}

export type EmailVerifyReq = {
  email : string;
  authKey : string;
}

export type EmailVerifyRes = {
  data? : string
  message? : string;
  status : string;
}

type KakaoLoginResData = {
  userId : number;
  userActiveStatus : boolean;
}

export type SignupErrorRes = {
  response?: {
    data: {
      data? :string;
      message: string;
      status : string;
    }
  }
}