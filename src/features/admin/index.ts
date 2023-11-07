import service from '@/features';

const AdminAPI = {
    getUserReports: () =>
        service.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reports/user`),
    getDateReports: () =>
        service.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reports/dating`),
};

export default AdminAPI;
