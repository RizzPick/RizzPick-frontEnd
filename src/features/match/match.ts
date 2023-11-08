import service from '@/features';

let fetchedUserIds: number[] = [];
export const MatchAPI = {
    fetchRandomUser: () =>
        service.get('https://willyouback.shop/api/userprofile/recommendations'),
};
