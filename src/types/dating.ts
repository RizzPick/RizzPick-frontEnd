export type createDate = {
    title: string;
    location: string;
    theme: string;
};

export type updateDate = {
    title: string;
    location: string;
    theme: string;
};

export type updateImage = {
    id: number;
    image: string;
};

export type ActivityResponse = {
    status: string;
    message: string;
    data: {
        activityId: number;
        userId: number;
        activityTitle: string;
        activityContent: string;
    };
};
