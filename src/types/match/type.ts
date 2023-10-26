export type Dating = {
    datingId: number;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
};

export type UserProfile = {
    userId: string;
    nickname: string;
    age: number;
    education?: string;
    gender?: string;
    location?: string;
    mbti?: string;
    religion?: string;
    profileImages: ImageObject[];
    dating?: Dating[];
};

export type ImageObject = {
    id: number;
    image: string;
};
