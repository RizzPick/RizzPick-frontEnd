import service from '@/features';
import { reportReq } from '@/types/match/type';

export const MatchAPI = {
    fetchRandomUser: () =>
        service.get('https://willyouback.shop/api/userprofile/recommendations'),
    sendLike: (targetUserId:string) =>
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/like/${targetUserId}`),
    sendNope: (targetUserId:string) =>
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/nope/${targetUserId}`),
    reportUser: (data: reportReq) => 
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/report/user?content=${data.content}&reportedUserId=${data.reportedUserId}`),
};