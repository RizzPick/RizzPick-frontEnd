// Enum으로 공통된 값들을 관리
export enum Gender {
  NONE = "NONE",
  MALE = "MALE",
  FEMALE = "FEMALE",
  TRANSGENDER = "TRANSGENDER",
  UNDEFINED = "UNDEFINED"
}

export enum Location {
  NONE = "NONE",
  SEOUL = "SEOUL",
  BUSAN = "BUSAN",
  DAEGU = "DAEGU",
  INCHEON = "INCHEON",
  DAEJEON = "DAEJEON",
  GWANGJU = "GWANGJU",
  ULSAN = "ULSAN"
}

export enum Mbti {
  NONE = "NONE",
  ISTJ = "ISTJ",
  ISFJ = "ISFJ",
  INFJ = "INFJ",
  INFP = "INFP",
  INTJ = "INTJ",
  ISTP = "ISTP",
  ISFP = "ISFP",
  INTP = "INTP",
  ESTP = "ESTP",
  ESFP = "ESFP",
  ENFP = "ENFP",
  ENTP = "ENTP",
  ESTJ = "ESTJ",
  ESFJ = "ESFJ",
  ENFJ = "ENFJ",
  ENTJ = "ENTJ"
}

export enum Religion {
  NONE = "NONE",
  CHRISTIANITY = "CHRISTIANITY",
  JUDAISM = "JUDAISM",
  ISLAM = "ISLAM",
  CATHOLICISM = "CATHOLICISM",
  HINDUISM = "HINDUISM",
  BUDDHISM = "BUDDHISM",
  CONFUCIANSM = "CONFUCIANSM",
  OTHERS = "OTHERS"
}

export enum Action {
  ADD = "ADD",
  DELETE = "DELETE",
  MODIFY = "MODIFY"
}

export type ProfileForm = {
  nickname: string;
  age: number;
  education: string;
  userActiveStatus?: boolean;
  gender: Gender;
  location: Location;
  mbti: Mbti;
  religion: Religion;
};

export type MyProfileRes = {
  userId : number;
  nickname: string;
  age: number;
  education: string;
  userActiveStatus: boolean;
  gender: Gender;
  location: Location;
  mbti: Mbti;
  religion: Religion;
  dating? : string;
  profileImages : ProfileImages[];
}

export type ProfileImages = {
  id : number;
  image : string;
}

export type ProfileImage = {
  id: string;
  action: Action;
  image: string;
};