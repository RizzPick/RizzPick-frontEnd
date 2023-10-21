export interface Dating {
    datingId: string;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
}

export interface AllDatingResponse {
    status: string;
    message: string | null;
    data: Dating[];
}
