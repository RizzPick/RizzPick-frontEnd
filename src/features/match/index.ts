import service from '@/features';

export const MatchAPI = {
    fetchRandomUser: () =>
        service.get('https://willyouback.shop/api/userprofile/recommendations'),
    sendLike: (targetUserId:string) =>
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/like/${targetUserId}`),
    sendNope: (targetUserId:string) =>
        service.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/nope/${targetUserId}`)
};