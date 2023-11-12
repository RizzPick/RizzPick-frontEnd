import service from '@/features';
import { ProfileForm } from '@/types/profile';

const ProfileAPI = {
    updateProfile: (data: ProfileForm) =>
        service.put(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/updateProfile`,
            data
        ),
    updateImage: (data: FormData) =>
        service.put(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profileImage/updateImage`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        ),
    getMyProfile: () =>
        service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/myProfile`),
};

export default ProfileAPI;
