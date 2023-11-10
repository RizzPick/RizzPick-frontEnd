export type Dating = {
    datingId: number;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
};

export type UserProfile = {
    userId: number;
    nickname: string;
    birthday: string;
    hobby : string;
    interest : string;
    gender?: string;
    location?: string;
    mbti?: string;
    religion?: string;
    profileImages: ImageObject[];
    dating?: Dating[];
    intro? :string;
};

export type ImageObject = {
    id: number;
    image: string;
};

export type reportReq = {
    reportedUserId : number;
    content : string;
}
