export interface MyDating {
    datingId: string;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
}

export interface MyAllDatingResponse {
    status: string;
    message: string | null;
    data: MyDating[];
}
