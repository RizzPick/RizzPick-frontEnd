import axios from 'axios';
import { UserProfile } from '../../types/match/type';
import { getCookie } from '@/utils/cookie';

let fetchedUserIds: number[] = [];

export async function fetchRandomUser(
    token: string,
    refreshToken: string
): Promise<UserProfile | any> {
    try {
        const response = await axios.get(
            'https://willyouback.shop/api/userProfiles',
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        console.log(response.data);

        const users = response.data.data;

        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        console.log(users.nickname);
        return randomUser;
    } catch (error: any) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
    }
}
