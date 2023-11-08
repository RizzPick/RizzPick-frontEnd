import axios from 'axios';
import { getCookie } from '@/utils/cookie';

export const sendLike = async (userId: string, targetUserId: string) => {
    try {
        const url = `https://willyouback.shop/api/like/${targetUserId}`;
        const response = await axios.post(url, {
            headers: {
                Authorization: getCookie('Authorization'),
                Authorization_Refresh: getCookie('Authorization_Refresh'),
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const sendNope = async (userId: string, targetUserId: string) => {
    try {
        const url = `https://willyouback.shop/api/like/${targetUserId}`;
        const response = await axios.post(
            url, // userId를 URL에 삽입합니다.
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
