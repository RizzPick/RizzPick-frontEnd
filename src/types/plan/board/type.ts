export interface Dating {
    datingId: string;
    userId: number;
    userNickname: string;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    createdAt: string;
    datingImage: { image: string };
}

export interface AllDatingResponse {
    status: string;
    message: string | null;
    data: Dating[];
}
