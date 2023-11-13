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

export enum Action {
    ADD = 'ADD',
    DELETE = 'DELETE',
    MODIFY = 'MODIFY',
}
