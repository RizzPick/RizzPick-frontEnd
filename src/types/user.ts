export type UserInfo = {
    status: string;
    message: string;
    data: {
        userId: number;
        nickname: string;
        age: number;
        intro: string;
        // education : string;
        gender: string;
        location: string;
        mbti: string;
        religion: string;
        profileImages: UserProfileImages[];
        dating: UserDating[];
    };
};

type UserProfileImages = {
    id: number;
    image: string;
};

type UserDating = {
    datingId: number;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
};
