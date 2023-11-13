import axios from 'axios';
import service from '@/features';
import { getCookie } from '@/utils/cookie';

import type {
    createDate,
    updateDate,
    ActivityResponse,
    updateImage,
} from '@/types/dating';
export const PlanAPI = {
    //! 더미데이터 생성
    createDating: (data: createDate) =>
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/dating`, data),
    //! 더미데이터 가져오기
    fetchDatingData: (slug: string) =>
        service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/dating/${slug}`),
    //! 더미데이터 수정 (유저 = 신규작성)
    updateDatingData: (id: string, data: updateDate) =>
        service.put(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dating/${id}`,
            data
        ),
    //! 이미지 수정 (유저 = 신규작성)
    updateImageData: (slug: string, formData: FormData) =>
        service.put(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dating/image/${slug}`,
            formData
        ),

    //! 활동 작성
    createActivity: async (
        datingId: number,
        content: string
    ): Promise<ActivityResponse> => {
        const response = await service.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/activity/${datingId}`,
            { content }
        );
        if (response.data && response.data.status === 'success') {
            return response.data;
        } else {
            throw new Error('Failed to create an activity');
        }
    },
    //! 활동 삭제
    deleteActivity: (id: number) =>
        service.delete(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/activity/${id}`
        ),
    //! 데이트 계획 전체 조회
    getDatings: () => service.get(`https://willyouback.shop/api/datings`),
    //! 유저가 작성한 데이트 계획 조회
    getMyDatingData: () =>
        service.get(`https://willyouback.shop/api/datings/user/me`),
};

//? 데이트 계획 작성 (더미 데이터 만들기!)
// export const createDating = async (
//     title: string,
//     location: string,
//     theme: string
// ): Promise<DatingResponse> => {
//     try {
//         const response = await axios.post(
//             'https://willyouback.shop/api/dating',
//             {
//                 datingTitle: title,
//                 datingLocation: location,
//                 datingTheme: theme,
//             },
//             {
//                 headers: {
//                     Authorization: getCookie('Authorization'),
//                     Authorization_Refresh: getCookie('Authorization_Refresh'),
//                 },
//             }
//         );
//         return response.data;
//     } catch (error: any) {
//         throw new Error(
//             `Failed to create dating: ${
//                 error.response?.data.message || error.message
//             }`
//         );
//     }
// };

// //? 더미 데이터 수정하기!
// export const updateDating = async (
//     id: number,
//     title: string,
//     location: string,
//     theme: string
// ): Promise<DatingResponse> => {
//     try {
//         const response = await axios.put(
//             `https://willyouback.shop/api/dating/${id}`,
//             {
//                 datingTitle: title,
//                 datingLocation: location,
//                 datingTheme: theme,
//             },
//             {
//                 headers: {
//                     Authorization: getCookie('Authorization'),
//                     Authorization_Refresh: getCookie('Authorization_Refresh'),
//                 },
//             }
//         );
//         console.log('Response:', response.data); // Response logging
//         return response.data;
//     } catch (error: any) {
//         console.error(
//             `Failed to update dating: ${
//                 error.response?.data.message || error.message
//             }`
//         );
//         throw new Error(
//             `Failed to update dating: ${
//                 error.response?.data.message || error.message
//             }`
//         );
//     }
// };

//? 데이트 전체 조회

// export const getDatings = async () => {
//     try {
//         const response = await axios.get(
//             'https://willyouback.shop/api/datings',
//             {
//                 headers: {
//                     Authorization: getCookie('Authorization'),
//                     Authorization_Refresh: getCookie('Authorization_Refresh'),
//                 },
//             }
//         );
//         return response.data.data;
//     } catch (error) {
//         console.error('Error fetching dating data:', error);
//         throw error;
//     }
// };

//? 데이트 상세 조회?
export async function getDatingData(datingId: string) {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/dating/${datingId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching dating data:', error);
        throw error;
    }
}

// //? 유저가 작성한 데이트 전체 조회
// export async function getMyDatingData() {
//     try {
//         const response = await axios.get(
//             `https://willyouback.shop/api/datings/user/me`,
//             {
//                 headers: {
//                     Authorization: getCookie('Authorization'),
//                     Authorization_Refresh: getCookie('Authorization_Refresh'),
//                 },
//             }
//         );
//         console.log(response);
//         return response.data.data;
//     } catch (error) {
//         console.error('Error fetching dating data:', error);
//         throw error;
//     }
// }

//? 본인 데이트 계획인지 확인
export async function getDatingAuthorId(
    datingId: string
): Promise<number | null> {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/dating/${datingId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data.authorId; // 데이터의 작성자 ID를 반환합니다.
    } catch (error) {
        console.error('Error fetching dating data:', error);
        throw error;
    }
}

// //? 활동 추가

// import { Activity, ActivityResponse } from '../../types/plan/activity/type';

// export const createActivity = async (
//     datingId: number,
//     content: string
// ): Promise<ActivityResponse> => {
//     try {
//         const response = await axios.post<ActivityResponse>(
//             `https://willyouback.shop/api/activity/${datingId}`,
//             {
//                 content,
//             },
//             {
//                 headers: {
//                     Authorization: getCookie('Authorization'),
//                     Authorization_Refresh: getCookie('Authorization_Refresh'),
//                 },
//             }
//         );
//         console.log(response.data.data);
//         return response.data;
//     } catch (error: any) {
//         throw new Error(
//             `Failed to create activity: ${
//                 error.response?.data.message || error.message
//             }`
//         );
//     }
// };

// // //? 활동삭제

// export const deleteActivity = async (
//     activityId: number
// ): Promise<ActivityResponse> => {
//     try {
//         const response = await axios.delete<ActivityResponse>(
//             `https://willyouback.shop/api/activity/${activityId}`,
//             {
//                 headers: {
//                     Authorization: getCookie('Authorization'),
//                     Authorization_Refresh: getCookie('Authorization_Refresh'),
//                 },
//             }
//         );
//         return response.data;
//     } catch (error: any) {
//         console.error(error); // 에러 로그 추가
//         throw new Error(
//             `Failed to delete activity: ${
//                 error.response?.data.message || error.message
//             }`
//         );
//     }
// };

//? 데이트 계획 클릭 후 데이트를 작성 한 유저정보 가져오기

export async function getUserProfileData(userId: number) {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/userProfile/${userId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        throw error;
    }
}

//? 활동 조회

export async function getActivity(userId: number) {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/activities
            `,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        throw error;
    }
}

//? 데이트 목록 조회
export async function getDateList(userId: number) {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/dataings/user/${userId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user profile data:', error);
        throw error;
    }
}

function saveToken(token: any) {
    localStorage.setItem('Authorization', token);
}
