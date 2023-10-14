import axios from 'axios';
import { UserProfile } from '../../types/match/type';
import { getCookie, getRefreshToken } from '@/utils/cookie';

let fetchedUserIds: number[] = [];

export async function fetchRandomUser(
    token: string,
    refreshToken: string
): Promise<UserProfile[]> {
    try {
        const response = await axios.get(
            'https://willyouback.shop//api/userprofile/recommendations',
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getRefreshToken(),
                },
            }
        );
        console.log(response);
        return response.data.data; // 데이터 배열을 반환합니다.
    } catch (error: any) {
        console.error(error);
        return [];
    }
}
