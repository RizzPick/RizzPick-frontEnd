export interface DatingData {
    datingId: number;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
}

export interface DatingResponse {
    status: string;
    message: string;
    data: DatingData;
}
