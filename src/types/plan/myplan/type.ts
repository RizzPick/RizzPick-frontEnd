export interface MyDating {
    datingId: string;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    createdAt: string;
}

export interface MyAllDatingResponse {
    status: string;
    message: string | null;
    data: MyDating[];
}

export interface DatingInfo {
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    activities: { activityContent: string }[];
}
