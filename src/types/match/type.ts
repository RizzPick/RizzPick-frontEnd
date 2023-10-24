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
};

export type ImageObject = {
    id: number;
    image: string;
};
