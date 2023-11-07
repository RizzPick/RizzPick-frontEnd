import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import UseProfile from './useProfile';
import UseChat from './useChat';
import { eraseCookie } from '@/utils/cookie';
import AuthAPI from '@/features/auth';

export default function useAuth() {
  const router = useRouter();
  const { clearCurrentProfile } = UseProfile();
  const { clearCurrentChat } = UseChat();

  const logout = () => {
    router.push('/');
    toast.success('로그아웃 처리되었습니다');
    eraseCookie('Authorization');
    eraseCookie('Authorization_Refresh');
    eraseCookie('status');
    sessionStorage.clear();
    clearCurrentProfile();
    clearCurrentChat();
  };

  const deActiveUser = async (userId : number) => {
    try {
      const response = await AuthAPI.deActiveUser(userId)
      console.log(response);
      if(response.status === 200) {
        router.push('/');
        toast.success('비활성화 처리되었습니다');
        eraseCookie('Authorization');
        eraseCookie('Authorization_Refresh');
        eraseCookie('status');
        sessionStorage.clear();
        clearCurrentProfile();
        clearCurrentChat();
      }
    } catch (error) {
      console.log(error);
      toast.error("회원탈퇴에 실패하였습니다.")
    }
  }


  return { logout, deActiveUser };
}