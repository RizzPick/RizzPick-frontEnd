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
  서울 = "서울",
  부산 = "부산",
  대구 = "대구",
  인천 = "인천",
  대전 = "대전",
  광주 = "광주",
  울산 = "울산"
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
  birthday: string;
  userActiveStatus?: boolean;
  gender: Gender;
  location: string;
  mbti: string;
  religion: string;
  intro : string;
  hobby : string;
  interest : string;
};

export type Dating = {
  datingId: number,
      userId: number,
      datingTitle: string,
      datingLocation: string,
      datingTheme: string
}
export type MyProfileRes = {
  userId : number;
  nickname: string;
  birthday: string;
  hobby : string;
  interest : string;
  userActiveStatus: boolean;
  gender: string;
  location: string;
  mbti: string;
  religion: string;
  dating? : Dating[];
  profileImages : ProfileImages[];
  intro : string;
  matchId? : number;
  matchStatus? : boolean;
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