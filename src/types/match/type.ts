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
    intro?: string;
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
