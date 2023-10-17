import service from '@/features';
import { ProfileForm } from '@/types/profile';
import { getCookie } from '@/utils/cookie';

const ProfileAPI = {
  updateProfile: (data: ProfileForm) => service.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/updateProfile`, data, {
    headers : {
      Authorization : getCookie('Authorization'),
      Authorization_Refresh : getCookie('Authorization_Refresh')
    }
  }),
  updateImage: (data:any) => service.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profileImage/updateImage`, data, {
    headers : {
      "Content-Type": "multipart/form-data",
      Authorization : getCookie('Authorization'),
      Authorization_Refresh : getCookie('Authorization_Refresh')
    }
  }),
  getMyProfile: () => service.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/myProfile`, {
    headers : {
      Authorization : getCookie('Authorization'),
      Authorization_Refresh : getCookie('Authorization_Refresh')
    }
  })
};

export default ProfileAPI;