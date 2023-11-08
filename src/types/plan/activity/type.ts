export interface Activity {
    activityId: number;
    activityContent: string;
}

export interface ActivityResponse {
    status: string;
    message: string;
    data: {
        activityId: number;
        userId: number;
        activityTitle: string;
        activityContent: string;
    };
}
