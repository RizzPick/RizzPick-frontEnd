import axios from 'axios';

export const sendLike = async (userId: string, targetUserId: string) => {
    try {
        const response = await axios.post(
            `https://willyouback.shop/api/like/${userId}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const sendNope = async (userId: string, targetUserId: string) => {
    try {
        const response = await axios.post(
            `https://willyouback.shop/api/nope/${userId}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
